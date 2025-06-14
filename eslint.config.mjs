import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
})

const eslintConfig = [
    ...compat.config({
        extends: ["next/core-web-vitals"],
        rules: {
            "no-unused-vars": "off",
            "react/jsx-max-props-per-line": ["off", { maximum: { single: 2, multi: 2 } }],
        },
    }),
]

export default eslintConfig
