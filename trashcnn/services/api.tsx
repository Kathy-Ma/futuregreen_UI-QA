const HOST = "https://ethnyao.pythonanywhere.com/api";
//const HOST = "http://127.0.0.1:8000/api"; //local host ip address (used for testing when pythonAnywhere server doesnt work)


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

// Function to submit user review and rating
// rating: number (1-5), feedback: optional string
export async function submitReview(rating: number, feedback?: string) {
    try {
        const body = {
            rating: rating,
            feedback: feedback || "",
        };

        const res = await fetch(HOST + "/reviews/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();

    } catch (error) {
        console.error("Error submitting review:", error);
        throw error;
    }
}