const { detailedDiff } = require('deep-object-diff')
const { spawnSync } = require('child_process')
const { isEqual, isEmpty } = require('lodash')
const current = require('./custom.json')
const git = require('simple-git')()

const rawOld = spawnSync('git', 'show master:custom.json'.split(' ')).stdout.toString()
const old = JSON.parse(rawOld)

const escape = string => {
    return `${string}`
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
}

const commitDiff = () => {
    const reallyCurrent = require('./custom.json')
    if (!isEqual(reallyCurrent, current)) {
        console.log('Exiting early because additional changes were made.')
        return // Exit early. Another instance of the script will get the change.
    }
    const difference = detailedDiff(old, current)
    if (Object.keys(difference).every(changeType => isEmpty(difference[changeType]))) {
        console.log('No changes detected.')
        return
    }

    const strokeToString = dictionary => stroke => `${stroke}: ${dictionary[stroke]}`
    const added =
        Object.keys(difference.added).map(strokeToString(current)).join(', ')
    const deleted =
        Object.keys(difference.deleted).map(strokeToString(old)).join(', ')
    const updated =
        Object.keys(difference.updated).map(stroke =>
            `${stroke}: ${old[stroke]} → ${current[stroke]}`
        ).join(', ')

    const commitMessage = [
        added && `${added}`,
        updated && `♻️${updated}`,
        deleted && `🗑️${deleted}`
    ].filter(x => x).map(escape).join(' ')
    console.log(commitMessage)
    git.add('.').commit(commitMessage).push('origin', 'master')
}

module.exports = {
    commitDiff,
    debouncedCommitDiff: () => {
        console.log('Waiting 60 seconds before committing changes to allow undos or additional changes.')
        setTimeout(commitDiff, 60 * 1000)
    }
}