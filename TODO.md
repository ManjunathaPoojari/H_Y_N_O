# Full-Stack Recipe Integration Task

## Backend - Data & API (Step 1)
- [x] Verify Recipe entity with required fields (id, name, description, imageUrl, calories)
- [x] Verify RecipeRepository using Spring Data JPA
- [x] Verify RecipeService for business logic
- [x] Verify RecipeController with @RestController and GET /api/recipes endpoint
- [x] Verify DataInitializer inserts initial recipes (Grilled Chicken Salad, Quinoa Buddha Bowl, Protein Oatmeal)
- [x] Verify CORS enabled for http://localhost:3000

## Backend Verification (Step 2)
- [ ] Test GET http://localhost:8081/api/recipes in browser/Postman
- [ ] Confirm returns HTTP 200 and JSON list of recipes

## Frontend - Remove Mock Data (Step 3)
- [ ] Locate HealthyRecipes.tsx component
- [ ] Remove hardcoded recipes array
- [ ] Remove symptom-based filtering logic (keep search/filter for future use)

## Frontend - Fetch Real Data (Step 4)
- [ ] Add state management for recipes, loading, error, empty states
- [ ] Implement fetch from http://localhost:8081/api/recipes
- [ ] Add useEffect to fetch on component mount
- [ ] Create mapping function from backend Recipe to frontend recipe format
- [ ] Implement loading spinner/text
- [ ] Implement error message display
- [ ] Implement empty list message
- [ ] Update UI to use fetched data instead of hardcoded array

## Final Verification (Step 5)
- [ ] Test full application
- [ ] Confirm recipes display: Grilled Chicken Salad, Quinoa Buddha Bowl, Protein Oatmeal
- [ ] Confirm no mock data remains
- [ ] Confirm dynamic fetching on page load
