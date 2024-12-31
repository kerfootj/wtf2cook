import { upsertRecipe } from '@/app/actions/upsertRecipe';
import { getURLFromRecipe } from '@/lib/getURLFromRecipe';
import { Recipe, Session } from '@/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { RecipeProps } from '../organisms';

type UpdateValue = string | number | Record<string, string | string[]> | null;

interface IRecipeContext {
    recipe: Recipe;

    editable: boolean;
    editing: boolean;
    edit: () => void;

    update: (key: string) => (value: UpdateValue) => void;
    cancel: () => void;

    preview: () => void;
    previewing: boolean;

    saving: boolean;
    save: () => Promise<void>;
}

const RecipeContext = createContext<IRecipeContext>({
    recipe: {} as Recipe,

    editable: false,
    editing: false,
    edit: () => {},

    update: () => () => {},
    cancel: () => {},

    preview: () => {},
    previewing: false,

    saving: false,
    save: async () => {},
});

export function useRecipe() {
    return useContext(RecipeContext);
}

/**
 * Maintain the state of the recipe and provide methods to update it.
 */
export function RecipeProvider(props: PropsWithChildren<RecipeProps>) {
    const [recipe, setRecipe] = useState(props.recipe);
    const [editing, setEditing] = useState(props.editing || false);
    const [saving, setSaving] = useState(false);
    const [previewing, setPreviewing] = useState(false);

    const router = useRouter();

    /**
     * Check if the current user is the author of the recipe.
     * If so, they can edit the recipe.
     */
    const session = useSession();
    const editable =
        (session.data as Session['data'])?.user?.id === recipe.user_id;

    /**
     * Puts the recipe into edit mode.
     */
    const edit = () => {
        setEditing(true);
        setPreviewing(false);
    };

    /**
     * Handles updating the recipe state.
     */
    const update = (key: string) => (value: UpdateValue) => {
        // create a deep copy of the recipe
        const updated_recipe = structuredClone(recipe);

        /**
         * Convert object dot notated key to an array of keys
         * e.g. "ingredients[0].title" -> ["ingredients", 0, "tile"]
         */
        const keys = key.replace(/\[(\d+)\]/g, '.$1').split('.');

        // create a reference to the object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: Record<string, any> = updated_recipe;
        for (const k of keys.slice(0, -1)) {
            // iterate the keys updating the reference to the nested property
            current = current[k];
        }

        // using the reference, update the value
        current[keys[keys.length - 1]] = value;

        // help copy ingredients and instructions from other sites
        const separateNewLines = (values: Array<string | null>): string[] => {
            return values
                .flatMap((value) => value?.split('\n') || [])
                .filter((v) => !!v)
                .map((value) => value.replace(/^\d+\.\s/, ''));
        };

        updated_recipe.ingredients = updated_recipe.ingredients.map(
            (ingredients) => ({
                ...ingredients,
                ingredients: separateNewLines(ingredients.ingredients),
            }),
        );

        updated_recipe.instructions = updated_recipe.instructions.map(
            (instructions) => ({
                ...instructions,
                instructions: separateNewLines(instructions.instructions),
            }),
        );

        setRecipe(updated_recipe);
    };

    /**
     * Reverts any changes made to the recipe and exits edit mode.
     */
    const cancel = () => {
        setRecipe(props.recipe);
        setEditing(false);
        setPreviewing(false);
    };

    /**
     * Toggles the preview mode.
     */
    const preview = () => {
        setEditing(false);
        setPreviewing(true);
    };

    /**
     * Saves the recipe to the database.
     */
    const save = async () => {
        setSaving(true);

        // create a deep copy of the recipe
        const recipe_to_save = structuredClone(recipe);

        // filter out any empty ingredients
        recipe_to_save.ingredients = recipe_to_save.ingredients
            .filter((ingredients) => !!ingredients)
            .map((ingredients) => {
                ingredients.ingredients = ingredients.ingredients.filter(
                    (ingredient) => !!ingredient,
                );

                return ingredients;
            });

        // filter out any empty instructions
        recipe_to_save.instructions = recipe_to_save.instructions
            .filter((instruction) => !!instruction)
            .map((instruction) => {
                instruction.instructions = instruction.instructions.filter(
                    (instruction) => !!instruction,
                );

                return instruction;
            });

        await upsertRecipe(recipe_to_save);

        setSaving(false);
        setEditing(false);
        setPreviewing(false);

        router.push(getURLFromRecipe(recipe_to_save));
    };

    return (
        <RecipeContext.Provider
            value={{
                recipe,
                editable,
                editing,
                edit,
                update,
                cancel,
                preview,
                previewing,
                saving,
                save,
            }}
        >
            {props.children}
        </RecipeContext.Provider>
    );
}
