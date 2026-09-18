pipeline {
    agent any

    tools {
        nodejs 'NodeJS-Latest'
    }

    triggers {
        cron('0 */5 * * *')
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
                powershell 'Compress-Archive -Path playwright-report\\* -DestinationPath playwright-report.zip -Force'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
        }
        success {
            withCredentials([string(credentialsId: 'gmail-app-password', variable: 'SMTP_PASSWORD')]) {
                emailext (
                    to: 'vikashkumaran.t@gmail.com',
                    replyTo: 'vikashkumaran.t@gmail.com',
                    subject: "SUCCESS: Jenkins Job ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
                    body: "The Playwright test execution completed successfully. View details at: ${env.BUILD_URL}",
                    attachmentsPattern: 'playwright-report.zip',
                    mimeType: 'text/html',
                    
                    // Explicit Job-Level Overrides:
                    overrideBuildSender: true,
                    from: 'vikashkumaran.t@gmail.com',
                    replyTo: 'vikashkumaran.t@gmail.com'
                )
            }
        }
        failure {
            withCredentials([string(credentialsId: 'gmail-app-password', variable: 'SMTP_PASSWORD')]) {
                emailext (
                    to: 'vikashkumaran.t@gmail.com',
                    replyTo: 'vikashkumaran.t@gmail.com',
                    subject: "FAILURE: Jenkins Job ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]",
                    body: "The Playwright test execution failed. View details at: ${env.BUILD_URL}",
                    attachmentsPattern: 'playwright-report.zip',
                    mimeType: 'text/html',
                    
                    // Explicit Job-Level Overrides:
                    overrideBuildSender: true,
                    from: 'vikashkumaran.t@gmail.com',
                    replyTo: 'vikashkumaran.t@gmail.com'
                )
            }
        }
    }
}