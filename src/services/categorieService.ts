import { API_URL } from "../utils/env";


export async function getAllCategorie(): Promise<string[]> {
    console.log('Fetching all categories');
    return ['Cat1','Cat2','Cat3'];
}

export async function saveCategorie(categorie: string): Promise<boolean> {
    console.log('Saving category: ', categorie);
    return true;
}

export async function getCategorie(idCategorie: string): Promise<boolean> {
    console.log('Fetching category with ID: ', idCategorie);
    return true;
}