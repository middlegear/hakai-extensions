
 ADD DATABSE STORAGE FOR PROVIDEREPISODES, B0TH ANILIST AND JIKAN
  

  improve error handling in missing params 


so use puppeteer to scrape for html content info(can be stored for later use) and servers
use server url in  a new page (another instance of puppeteer ) to get m3u8 links listening in evaluating js

 Trending,toprated,popular ,upcoming movies and tv series


 Backdrops:

Small: w300
Medium: w780
Large: w1280 (or original if truly necessary)



Posters:

Small: w185
Medium: w342
Large: w780 (or original if truly necessary)




// Assuming 'axios' or 'node-fetch' is used for making requests
// and 'TMDB_API_READ_ACCESS_TOKEN' is defined.

async function getTvShowDetails(seriesId, TMDB_API_READ_ACCESS_TOKEN) {
    try {
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
                'accept': 'application/json'
            }
        };

        const response = await fetch(url, options); // Or await axios.get(url, options);

        if (!response.ok) { // Check for HTTP errors (e.g., 404, 500)
            const errorBody = await response.json(); // Attempt to parse error body
            // Create a structured error if the response wasn't OK
            const httpError = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            httpError.statusCode = response.status;
            httpError.body = errorBody; // Attach the error body for more info
            throw httpError; // Throw it to be caught by our catch block
        }

        const data = await response.json();
        const seasons = data.seasons || []; // Ensure seasons is an array, even if empty

        // Rename 'last_air_date' to 'endDate' for consistency
        if (data.last_air_date !== undefined) {
            data.endDate = data.last_air_date;
            delete data.last_air_date;
        }

        // Rename 'first_air_date' to 'startDate' for consistency
        if (data.first_air_date !== undefined) {
            data.startDate = data.first_air_date;
            delete data.first_air_date;
        }

        return { data, seasons };

    } catch (error) {
        // --- This is where you use Error.isError() ---
        if (Error.isError(error)) {
            // This is a standard JavaScript Error object or a custom error we threw
            console.error("An error occurred while fetching TV show details:", error.message);
            // Optionally log the stack trace for debugging purposes
            // console.error("Error stack:", error.stack);

            // You might want to return different error details based on your needs
            return {
                data: null,
                error: {
                    message: error.message,
                    name: error.name, // e.g., 'Error', 'TypeError', 'HTTP Error'
                    // If you attached custom properties to the error, include them
                    statusCode: error.statusCode, // For HTTP errors
                    body: error.body // For HTTP error response bodies
                }
            };
        } else {
            // This catches anything else that might be thrown (e.g., a string, number, or plain object)
            // It's a good idea to log this type of error, as it's unexpected
            console.error("An unknown or non-standard error was caught:", error);
            return {
                data: null,
                error: {
                    message: "An unexpected error occurred.",
                    details: error // Return the raw error for debugging if needed
                }
            };
        }
    }
}

// Example usage:
// (Remember to replace 'YOUR_API_READ_ACCESS_TOKEN' with your actual token)
/*
getTvShowDetails(82856, 'YOUR_API_READ_ACCESS_TOKEN') // The Mandalorian
    .then(result => {
        if (result.error) {
            console.error("Failed to get show details:", result.error);
        } else {
            console.log("TV Show Data:", result.data);
            console.log("Seasons:", result.seasons);
            console.log("Start Date (renamed):", result.data.startDate);
            console.log("End Date (renamed):", result.data.endDate);
        }
    });

getTvShowDetails(999999999, 'YOUR_API_READ_ACCESS_TOKEN') // Non-existent ID
    .then(result => {
        if (result.error) {
            console.error("\nFailed to get non-existent show details:", result.error);
        }
    });
*/


1. Referer for megacloud needs to be dynamic
2. remove the anoyinh folders



https://vidjoy.wtf/watch/movie/715287/Stepmom-s-Desire