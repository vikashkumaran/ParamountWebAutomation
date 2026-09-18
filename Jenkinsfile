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
                bat 'npx playwright install chromium'
            }
        }
        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
        stage('Package Report') {
            steps {
                // Compress full report folder to keep styles and assets intact
                powershell 'Compress-Archive -Path playwright-report\\* -DestinationPath playwright-report.zip -Force'
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
                recipientProviders: [],
                subject: "SUCCESS: Jenkins Job ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
                body: "The Playwright test execution completed successfully. View details at: ${env.BUILD_URL}",
                attachmentsPattern: 'playwright-report.zip'
            )
        }
        failure {
            emailext (
                to: 'vikashkumaran.t@gmail.com',
                recipientProviders: [],
                subject: "FAILURE: Jenkins Job ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
                body: "The Playwright test execution failed. View details at: ${env.BUILD_URL}",
                attachmentsPattern: 'playwright-report.zip'
            )
        }
    }
}