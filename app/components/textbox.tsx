"use client";

interface TextBoxProps {
    heading: string;
    description: string;
    className?: string;
}

export function TextBox({ heading, description, className = ''}: TextBoxProps) {
    return (
        <div className={`border-l-2 border-gray-300 dark:border-gray-600 pl-6 ${className}`}>
            <h2 className="text-base font-normal mb-2 text-gray-800 dark:text-gray-200">
                {heading}
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {description}
            </p>
        </div>
    );
}