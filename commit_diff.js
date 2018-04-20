const { detailedDiff } = require('deep-object-diff')
const { spawnSync } = require('child_process')
const current = require('./custom.json')
const git = require('simple-git')()

const rawOld = spawnSync('git', 'show master:custom.json'.split(' ')).stdout.toString()
const old = JSON.parse(rawOld)

// Debounce the script to allow multiple similar strokes to be grouped together.
setTimeout(() => {
    const reallyCurrent = require('./custom.json')
    if (JSON.stringify(reallyCurrent) !== JSON.stringify(current)) {
        return // Exit early. Another instance of the script will get the change.
    }
    const difference = detailedDiff(old, current)

    const strokeToString = dictionary => stroke => `${stroke}:${dictionary[stroke]}`
    const added =
        Object.keys(difference.added).map(strokeToString(current)).join(', ')
    const deleted =
        Object.keys(difference.deleted).map(strokeToString(old)).join(', ')
    const updated =
        Object.keys(difference.updated).map(stroke =>
            `${stroke}:${old[stroke]}→${current[stroke]}`
        ).join(', ')

    const commitMessage = [updated && `♻️${updated}`, added && `🆕${added}`, deleted && `🗑️${deleted}`].filter(x => x).join(' ')
    git.add('.').commit(commitMessage).push('origin', 'master')
}, 60*1000)