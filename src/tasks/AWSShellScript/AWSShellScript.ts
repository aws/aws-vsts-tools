/*!
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 */

import * as tl from 'azure-pipelines-task-lib/task'

import { SdkUtils } from 'lib/sdkutils'
import { warnIfBuildAgentTooLow } from 'lib/vstsUtils'

import { TaskOperations } from './TaskOperations'
import { buildTaskParameters } from './TaskParameters'

async function run(): Promise<number> {
    SdkUtils.readResources()
    process.env.AWS_EXECUTION_ENV = 'VSTS-AWSShellScript'
    const taskParameters = buildTaskParameters()

    return new TaskOperations(taskParameters).execute()
}

run()
    .then(result => {
        const tooLow = warnIfBuildAgentTooLow()
        tl.setResult(
            tooLow ? tl.TaskResult.SucceededWithIssues : tl.TaskResult.Succeeded,
            tl.loc('BashReturnCode', result)
        )
    })
    .catch(error => {
        tl.setResult(tl.TaskResult.Failed, `${error}`)
    })