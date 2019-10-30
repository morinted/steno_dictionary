# Ted's Steno Dictionary

My personal steno dictionary that I started shortly after downloading Plover in 2015.

See `custom.json` for all the strokes I have.

I've since contributed many of my strokes into the main Plover dictionary. What's left is what remains different from the main dictionary.

## Automated Script

I have a script running to automatically push changes I make to the dictionary to git.

If you would like to use this yourself, this is my process:

1. Clone the repo.
1. `npm install`
1. `npm start`

Every time a change is made to `custom.json`, `npm run debounced-commit-diff` is run which will perform a diff of the changes you made within a minute rolling window. Then a commit is made and pushed to the repo.
