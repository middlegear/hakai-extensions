/// make a roubust error handling

///int the gogoganime search function i should implement an algorith that fetches searches anime or fetches info based on dub or subbing
/////CHECK FOR RETURNED DATA IN EACH FUNCTION

////TESTS WILL HAVE TO BE WRITTEN

///should be to lowercase the providers enums from the swithcases when mapping using infobyId
for anilist and jikan it should be noted that there is search , fetchInfoBYid, animecharacters, fetchanimeACTORS ,trending(), seasons, ctegories in like mywebapp

rework on the promise functions

anilist and jikan , tmdb all the providers should have the same response structure

lru cache
add have atypes folder for all ts files
have a global file types for streaming sources and formats for video

/FIX THE AIRING NS BROADCAST STUFF ON ANILIST AND JIKAN FOR NOW ITS SKIPPED

find kitsu api and use for episode description and banner

top airing for anilist has next episode airing
while the rest of the queries have start and end dates

make sure to do this in every anilist and jikan query
return {
success: true,
pagination : pagination,
data :res

}

in the end add some rankings

work on class documentations with jsdocs
