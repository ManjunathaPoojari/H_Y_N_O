# TODO: Implementing Join Our Wellness Community Section

## Current Task: Add Community Section to NutritionWellness.tsx

### Steps:
1. [ ] Update imports in src/components/patient/NutritionWellness.tsx to include Video and Users2 from lucide-react.
2. [ ] Insert the new community section JSX after the Nutritionists section (after the closing </div> of the mb-12 div).
3. [ ] Implement the "Join Community" button to trigger a success notification using addNotification.
4. [ ] Verify the changes by running the app (e.g., execute `npm run dev` if needed) and check for rendering issues.
5. [ ] Update TODO.md to mark completed steps and note any next tasks (e.g., add recipes section).

### Notes:
- Place the section after Nutritionists for logical flow: Toolbox -> Experts -> Community.
- Use existing Card component for the four feature cards.
- Icons: Users (Supportive Community), Award (Wellness Challenges), Video (Live Events), Users2 (Support Groups).
- Button action: addNotification with success message since no navigation path specified.
