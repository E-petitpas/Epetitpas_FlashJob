import { API_URL, token } from "../utils/env";

// React component removed from this file. Only service logic remains.

export interface Categorie {
    id: number;
    nom: string;
}

export async function getAllCategorie(): Promise<Categorie[]> {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: {
            'accept': '*/*'
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
    }
    return await response.json();
}

export async function saveCategorie(categorie: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom: categorie })
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de la catégorie');
    }
    return true;
}

export async function getCategorie(idCategorie: string): Promise<any> {
    const response = await fetch(`${API_URL}/categories/${idCategorie}`, {
        method: 'GET',
        headers: {
            'accept': '*/*'
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la catégorie');
    }
    return await response.json();
}