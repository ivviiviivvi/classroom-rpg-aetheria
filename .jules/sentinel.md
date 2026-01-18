## 2024-05-24 - [Prompt Injection Mitigation]
**Vulnerability:** User input was directly interpolated into LLM prompts without sanitization or delimiters.
**Learning:** LLM prompts act as code when they include user instructions. Unsanitized interpolation allows users to override system instructions (Prompt Injection).
**Prevention:** Always wrap user input in XML-like delimiters (e.g., `<user_input>...</user_input>`) and instruct the LLM to only process content within those delimiters. Escape any occurrences of the closing delimiter in the user input.
