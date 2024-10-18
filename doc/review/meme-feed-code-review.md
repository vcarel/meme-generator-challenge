# Code Review

## 1. Code Style

### 1.1 Linting

- 12 linting errors and warnings found in the current codebase.

**Recommendation**:
➡️ Fix linting errors before addressing performance issues.

### 1.2 Formatting

- No formatter is currently used in the project.

**Recommendation**:

➡️ Add Prettier or Biome for consistent code formatting.

### 1.3 Consistency and Readability

- Inconsistent use of arrow functions and regular functions across the codebase.
- **Note**: For TanStack routes, regular functions are required, but elsewhere arrow functions should be used consistently.

  **Example:**
  In `src/routes/_authentication/create.tsx`:

  ```tsx
  const handleDeleteCaptionButtonClick = (index: number) => {
    ...
  };

  function CreateMemePage() {
    ...
  }
  ```

- Unnecessary comments. For instance, the comment below is redundant since the function name is self-explanatory:

  ```tsx
  /**
   * Get a user by their id
   * @param token
   * @param id
   * @returns
   */
  export async function getUserById(token: string, id: string): Promise<GetUserByIdResponse> {
    ...
  }
  ```

**Recommendations**:

➡️ Use arrow functions consistently (except where regular functions are required for TanStack routes).
➡️ Remove irrelevant comments and only add them where necessary.

### 1.4. React Code Style

- Use of render functions (e.g., `renderNoPicture`) where components (e.g., `<NoPicture />`) could be used instead.
- Excessive business logic embedded within React components.
- File name not matching component name. For example, in `meme-picture.tsx` for MemePicture. This makes it harder to find components.

**Recommendations**:

➡️ Extract render functions into separate components and move them to different files.
➡️ Move query functions outside of components or refactor them into custom hooks to improve code cleanliness.
➡️ Rename files to match the component name.

## 2. Tooling

- Missing npm command to check types
- Missing commits to prevent pushing code with linting errors, type errors, or failing tests.

**Recommendations**:

➡️ Add a `type-check` npm script to check types.
➡️ Use Husky to prevent pushing code with linting errors, type errors, or failing tests.

## 3. User Experience

### 3.1 Accessibility

- Labels are not properly wired to their respective inputs. For example, in `src/routes/login.tsx`:

  ```tsx
  <FormControl>
    <FormLabel>Username</FormLabel>
    <Input
      type="text"
      placeholder="Enter your username"
      bg="white"
      size="sm"
      {...register("username")}
    />
  </FormControl>
  ```

**Recommendations**:

➡️ Install ESLint A11y rules or use Biome’s default rules to catch accessibility issues.
➡️ Ensure all labels are correctly linked to their inputs.

### 3.2 Error Management

- Errors from `useQuery` are not handled, potentially resulting in broken pages.

**Recommendation**:

➡️ Implement global error handling and use `useSuspenseQuery` when possible.

### 3.3. Performance

- The same user data is fetched multiple times in the meme feed.
- On the meme feed page, all memes are loaded at once, including those below the fold.
- Sequential fetches are being used where parallel fetches would be more efficient.

**Recommendations**:

➡️ Use tanstack-query cache to load user data only once.
➡️ Implement a virtual list using a library like [TanStack Virtual](https://tanstack.com/virtual) to optimize the loading of large lists, or add pagination to the meme feed.
➡️ Use `Promise.all` to fetch data in parallel.

### 3.4. Critical issues

- Authentication is lost when the user refreshes the page.
- Meme caption cannot be changed
- Meme cannot submit button does not work
