import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-csharp';

const CodeBlock = ({ code, language = 'csharp' }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [code]);

    return (
        <pre>
            <code className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
};

export default CodeBlock;
