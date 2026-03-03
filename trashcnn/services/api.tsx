const HOST = "http://127.0.0.1:8000/api";

export async function predictImage(base64Data: string, fileName: string, width: number, height: number) {
    try {
        const body = {
            image_name: fileName,
            image_data: base64Data,  // already base64, no conversion needed
            image_width: width,
            image_height: height,
        };

        const res = await fetch(HOST + "/predict/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();

    } catch (error) {
        console.error("Error predicting image:", error);
        throw error;
    }
}