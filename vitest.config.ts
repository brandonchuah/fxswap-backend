import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["services/**/test/**/*.test.ts", "packages/**/test/**/*.test.ts"],
    globals: true,
    setupFiles: [],
  },
});
