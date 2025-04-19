#!/bin/bash

# Navigate to the blog directory
cd "$(dirname "$0")"

# Install the required Tailwind plugins
npm install @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio

echo "Tailwind plugins installed successfully!"