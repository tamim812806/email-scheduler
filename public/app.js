document.getElementById('email-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const scheduleTime = document.getElementById('schedule-time').value;

  const response = await fetch('https://your-backend-url.com/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, message, scheduleTime })
  });

  const result = await response.text();
  document.getElementById('status').innerText = result;
  loadScheduledEmails();
});

async function loadScheduledEmails() {
  const response = await fetch('https://your-backend-url.com/scheduled-emails');
  const emails = await response.json();
  const emailList = document.getElementById('scheduled-emails');
  emailList.innerHTML = '';
  emails.forEach((email) => {
      const li = document.createElement('li');
      li.textContent = `${email.email} - ${email.subject} - ${email.status}`;
      emailList.appendChild(li);
  });
}

loadScheduledEmails();
