const HOST = "http://127.0.0.1:8000";

export async function predictImage(imageUri: string) {
    try {
        const formData = new FormData();

        const file: any = {
            uri: imageUri,
            type: "image/jpeg",
            name: "upload.jpg",
        };

        formData.append("image", file);

        const response = await fetch(HOST + "/predict", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error predicting image:", error);
        throw error;
    }
}