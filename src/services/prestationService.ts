import { API_URL, token } from "../utils/env";

function getToken(): string | null {
    return localStorage.getItem("token");
}

export async function saveServiceDraft(serviceId: number | null, newService: any): Promise<boolean> {
    const token = getToken();
    if (!token) return false;
    const body = {
        service: newService,
        liste_offre: [{}]
    };
    if (serviceId) {
        // PATCH si serviceId existe
        const response = await fetch(`${API_URL}/brouillons/${serviceId}`, {
            method: "PATCH",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        return response.ok;
    } else {
        // POST sinon
        const response = await fetch(`${API_URL}/brouillons`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        return response.ok;
    }
}

export async function saveOffreDraft(offre: any): Promise<boolean> {
    console.log('Saving offer draft: ', offre);
    return true;
}

export async function getDraftById(draftId: string): Promise<any> {
    const response = await fetch(`${API_URL}/brouillons/${draftId}`, {
        method: "GET",
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    return null;
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