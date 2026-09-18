pipeline {
    agent any

    tools {
        nodejs 'NodeJS-Latest'
    }

    triggers {
        cron('H/15 * * * *')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install --with-deps'
            }
        }
        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
        }
        success {
            emailext (
                to: 'vikashkumaran.t@gmail.com',
                subject: "SUCCESS: Jenkins Job ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
                body: "The Playwright test execution completed successfully. The report is attached to this email.\n\nView build details: ${env.BUILD_URL}",
                attachmentsPattern: 'playwright-report/index.html'
            )
        }
        failure {
            emailext (
                to: 'vikashkumaran.t@gmail.com',
                subject: "FAILURE: Jenkins Job ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
                body: "The Playwright test execution failed. The report is attached to this email.\n\nView build details: ${env.BUILD_URL}",
                attachmentsPattern: 'playwright-report/index.html'
            )
        }
    }
}