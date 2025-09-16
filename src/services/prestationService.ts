import { API_URL } from "../utils/env";

export async function saveServiceDraft(service: any): Promise<boolean> {
    console.log('Saving service draft: ', service);
    return true;
}

export async function saveOffreDraft(offre: any): Promise<boolean> {
    console.log('Saving offer draft: ', offre);
    return true;
}

export async function saveAllPrestation(prestation: any): Promise<boolean> {
    console.log('Saving service draft: ', prestation);
    return true;
}

export async function getAllPrestations(): Promise<any[]> {
    const response = await fetch(`${API_URL}/prestations`);                     
    const data = await response.json();
    return data;
}

export async function getPrestationById(id: string): Promise<any> {
    const response = await fetch(`${API_URL}/prestations/${id}`);                     
    const data = await response.json();
    return data;
}