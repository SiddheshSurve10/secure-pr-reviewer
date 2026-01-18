import { Application } from 'probot';

const app = new Application();

app.on('pull_request.opened', async (context) => {
  const message = 'Hello! Thanks for opening a pull request.';
  await context.octokit.issues.createComment({
    ...context.issue(),
    body: message,
  });
});

app.start();