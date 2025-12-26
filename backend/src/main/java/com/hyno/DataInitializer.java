package com.hyno;

import com.hyno.entity.Recipe;
import com.hyno.entity.Symptom;
import com.hyno.repository.RecipeRepository;
import com.hyno.repository.SymptomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private SymptomRepository symptomRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create sample symptoms
        if (symptomRepository.count() == 0) {
            List<String> symptomNames = List.of(
                "Fever", "Cough", "Headache", "Fatigue", "Dizziness",
                "Nausea", "Vomiting", "Diarrhea", "Constipation", "Indigestion",
                "Acidity", "Bloating", "Gas", "Insomnia", "Anxiety",
                "Depression", "Joint Pain", "Muscle Pain", "Cold", "Sore Throat"
            );

            for (String name : symptomNames) {
                Symptom symptom = new Symptom();
                symptom.setName(name);
                symptomRepository.save(symptom);
            }
        }

        // Create sample recipes
        if (recipeRepository.count() == 0) {
            List<Symptom> symptoms = symptomRepository.findAll();

            for (int i = 0; i < symptoms.size(); i++) {
                Symptom symptom = symptoms.get(i);

                for (int j = 0; j < 5; j++) {
                    Recipe recipe = new Recipe();
                    recipe.setName("Recipe for " + symptom.getName() + " - " + (j + 1));
                    recipe.setDescription("Healthy recipe to help with " + symptom.getName().toLowerCase());
                    recipe.setCategory("lunch");
                    recipe.setCuisineType("Healthy");
                    recipe.setPrepTimeMinutes(15);
                    recipe.setCookTimeMinutes(20);
                    recipe.setServings(2);
                    recipe.setDifficulty("easy");
                    recipe.setIngredients(List.of("200g main ingredient", "100g vegetables", "50g healthy addition", "2 tbsp oil"));
                    recipe.setInstructions("Prepare ingredients. Cook according to recipe. Serve hot.");
                    recipe.setCaloriesPerServing(300 + j * 50);
                    recipe.setProteinGPerServing(25.0);
                    recipe.setCarbsGPerServing(30.0);
                    recipe.setFatGPerServing(15.0);
                    recipe.setFiberGPerServing(5.0);
                    recipe.setSugarGPerServing(3.0);
                    recipe.setSodiumMgPerServing(400.0);
                    recipe.setIsVegetarian(true);
                    recipe.setIsVegan(false);
                    recipe.setIsGlutenFree(true);
                    recipe.setIsDairyFree(false);
                    recipe.setSymptom(symptom);
                    recipeRepository.save(recipe);
                }
            }
        }
    }
}
