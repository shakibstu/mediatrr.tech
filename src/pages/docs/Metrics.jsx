import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const Metrics = () => {
    const openTelemetryCode = `using MediatRR;

builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddMeter(MediatRRInstrumentation.MeterName)   // "MediatRR"
        .AddPrometheusExporter());`;

    const listenerCode = `using System.Diagnostics.Metrics;

var listener = new MeterListener();
listener.InstrumentPublished = (instrument, l) =>
{
    if (instrument.Meter.Name == MediatRRInstrumentation.MeterName)
        l.EnableMeasurementEvents(instrument);
};
listener.SetMeasurementEventCallback<long>((instrument, value, tags, _) =>
    Console.WriteLine($"{instrument.Name} {value} {string.Join(" ", tags.ToArray())}"));
listener.Start();

// Observable gauges are only sampled when you ask:
listener.RecordObservableInstruments();`;

    return (
        <div>
            <h1>Metrics</h1>
            <p className="doc-lead">
                The notification worker is a queue with a pool of handlers, and like any queue it needs to be
                watched: is it keeping up, how long do handlers take, how often do they fail. Since 2.1 MediatRR
                emits that through <code>System.Diagnostics.Metrics</code>, the standard .NET metrics API, so it
                plugs into OpenTelemetry, Prometheus, Application Insights or a plain <code>MeterListener</code>.
            </p>

            <H2>The Meter</H2>
            <p>
                All instruments belong to one meter named <code>MediatRR</code>, exposed as the constant{' '}
                <code>MediatRRInstrumentation.MeterName</code>. When an <code>IMeterFactory</code> is registered,
                which <code>services.AddMetrics()</code> and the OpenTelemetry packages do, the meter is created
                through it so it is scoped to your container and disposed with it. Without a factory MediatRR
                creates the meter itself. Nothing is emitted until something listens.
            </p>

            <H2>Instruments</H2>
            <div className="table-wrap">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Instrument</th>
                            <th>Kind</th>
                            <th>Tags</th>
                            <th>Meaning</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>mediatrr.notifications.published</code></td>
                            <td>counter</td>
                            <td><code>notification.type</code></td>
                            <td>Notifications accepted by <code>Publish</code> and queued. Notifications without handlers are not counted</td>
                        </tr>
                        <tr>
                            <td><code>mediatrr.notifications.queued</code></td>
                            <td>observable gauge</td>
                            <td></td>
                            <td>Notifications waiting in the channel right now</td>
                        </tr>
                        <tr>
                            <td><code>mediatrr.handlers.in_flight</code></td>
                            <td>up-down counter</td>
                            <td></td>
                            <td>Handler attempts currently running, including dead letter handlers of a failed attempt</td>
                        </tr>
                        <tr>
                            <td><code>mediatrr.handlers.duration</code></td>
                            <td>histogram, ms</td>
                            <td><code>notification.type</code>, <code>handler.type</code>, <code>outcome</code></td>
                            <td>Duration of one handler attempt. <code>outcome</code> is <code>success</code>, <code>failure</code> or <code>cancelled</code></td>
                        </tr>
                        <tr>
                            <td><code>mediatrr.handlers.retries</code></td>
                            <td>counter</td>
                            <td><code>notification.type</code>, <code>handler.type</code></td>
                            <td>Failed attempts that are retried under the <Link to="/docs/notifications#retry-policies">retry policy</Link></td>
                        </tr>
                        <tr>
                            <td><code>mediatrr.dead_letters</code></td>
                            <td>counter</td>
                            <td><code>notification.type</code>, <code>handler.type</code></td>
                            <td>Entries written to the dead-letter queue. <code>handler.type</code> is omitted when no handler ran</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                Type tags carry the full type name, for example <code>MyApp.Events.OrderPlaced</code>. The
                duration histogram records every attempt, so a handler retried twice contributes three
                measurements, two with <code>failure</code> and one with the final outcome.
            </p>

            <H2>OpenTelemetry</H2>
            <p>Add the meter by name and export it wherever your other metrics go:</p>
            <CodeBlock code={openTelemetryCode} />

            <H2>Without OpenTelemetry</H2>
            <p>
                A <code>MeterListener</code> from the BCL is enough for tests, console tools or a custom
                exporter:
            </p>
            <CodeBlock code={listenerCode} />

            <H2>Reading the Numbers</H2>
            <ul>
                <li>
                    <strong><code>queued</code> keeps growing</strong>: handlers are slower than publishers. Raise{' '}
                    <code>MaxConcurrentMessageConsumer</code> if the handlers are I/O bound, or make them cheaper.
                    When it reaches <code>NotificationChannelSize</code>, <code>Publish</code> starts to block
                </li>
                <li>
                    <strong><code>in_flight</code> sits at <code>MaxConcurrentMessageConsumer</code></strong>: the pool is
                    saturated. Combined with a growing <code>queued</code> this is the signal to scale
                </li>
                <li>
                    <strong><code>retries</code> climbs for one <code>handler.type</code></strong>: a flaky dependency.
                    Consider <code>BackoffMultiplier</code> so retries stop hammering it
                </li>
                <li>
                    <strong><code>dead_letters</code> is non-zero</strong>: something needs a human or a{' '}
                    <Link to="/docs/dead-letter-handlers">dead letter handler</Link>. Alert on it
                </li>
                <li>
                    <strong><code>duration</code> with <code>outcome=cancelled</code></strong>: handlers were cut off
                    by a forced shutdown. Check the host's shutdown timeout
                </li>
            </ul>

            <Callout variant="info" title="Requests and streams">
                <p>
                    Only the notification pipeline is instrumented, because that is where work happens out of
                    sight of the caller. <code>Send</code> and <code>CreateStream</code> run inline; time them
                    with a <Link to="/docs/behaviors">pipeline behavior</Link> if you need to.
                </p>
            </Callout>
        </div>
    );
};

export default Metrics;
