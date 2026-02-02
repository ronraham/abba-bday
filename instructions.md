We are building a web app (react, latest, typescript) for a birthday party for our dad, Oren Glanz.
The app has currently 2 functionallities:
1. RSVP who is coming - allowing people to add their name, party, how many etc (unique by name)
2. Select songs + a few words why this song and happy birthday words etc.

For the select songs it should open a modal allowing to search songs (thru some youtube API - research whats possible), then select it (allow playing it as well), add in a nice input box a few words + who is dedicating this song, then submit and it will be added to the playlist.
Playlist can be visible to everyone though the extra words are hidden and available only to who is set as an admin and knows a password (set in an env file)
The playlist should be displayed nicely and elegantly (in general use a clean and elegant design system). they should also be available to be played from there (as preview)

As a database I will later set up a supabase postgres table but for now mock a local storage in a file (csv?) but create connectors we can later swap for real sql queries to use postgres.

the design should be clean with attached theme.png image in the repo as inspiration.

Its all react frontend without a backend (with supabase later as db), make it interactive, modern UIUX, use all the common patterns and design componenets. feel free to add functionallities as seems fit.

We will deploy this using cloudflare pages or something similar but lets start with running it locally as we build