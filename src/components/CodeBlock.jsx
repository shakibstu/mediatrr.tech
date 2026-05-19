import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import { Check, Copy } from 'lucide-react';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-bash';

const CodeBlock = ({ code, language = 'csharp' }) => {
    const codeRef = useRef(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (codeRef.current) {
            // Scope highlighting to this block so siblings aren't re-tokenised on every mount.
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard API can fail in non-secure contexts; surface to the user.
            setCopied(false);
        }
    };

    return (
        <div className="code-block">
            <button
                className="code-copy-btn"
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy code'}
                type="button"
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <pre>
                <code ref={codeRef} className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

export default CodeBlock;
