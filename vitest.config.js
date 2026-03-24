import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom", // default environment
    globals: true, // lets you use describe/it/expect without imports
  },
});
