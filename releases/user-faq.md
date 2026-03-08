# Implementation Wizard
## Frequently Asked Questions — Version 1.0

| Field | Detail |
|---|---|
| **Document** | user-faq.md |
| **Prepared By** | Trainer Persona — Step 21 of 24 |
| **Date** | 2026-03-08 |
| **App URL** | https://kulyog.github.io/implementation-wizard/ |

---

## Daily Use

**How do I open the app?**
Go to https://kulyog.github.io/implementation-wizard/ in your browser. Bookmark it. That is the only way to access it — there is no icon on your desktop, no app to install, and no login page.

**The app is blank when I open it. Where are my projects?**
This usually means one of three things: you are using a different browser than usual, you have cleared your browser data, or you are on a different computer. Your data is stored in the specific browser you were using when you created your projects.

If you have an export backup file, click **↓ Import** and select it — your projects will be restored immediately. If you have no backup, the data is gone. This is why exporting after every session matters.

**Can I have the app open in two browser tabs at once?**
You can, but do not. Both tabs read from and write to the same local storage. If you make changes in both tabs simultaneously, one set of changes will overwrite the other when either tab saves. Open one tab only.

**Does the app work offline?**
Yes, once it has loaded in your browser. You do not need an internet connection to use it. You do need an internet connection to open it for the first time or after a browser cache clear, because it loads from GitHub Pages.

**I made changes but the app seems to have reverted them after I refreshed. What happened?**
This should not happen — the app saves every change automatically. However, if you refreshed the page very quickly after making a change (within the auto-save debounce window of about half a second), a very recent keystroke in the notes field might not have been saved. The workaround: wait a moment after typing before refreshing. All other changes (status updates, project creation, etc.) save instantly.

---

## The 24-Step Process

**I am on Step 6 but the app is saying Step 5 is not complete. Can I skip it?**
Steps 5 and 6 are the only exception in the process — they can be done in either order once Step 4 is Complete. You do not have to complete Step 5 before Step 6. However, Step 7 requires *both* Steps 5 and 6 to be Complete before you can mark it done. You cannot skip steps in the forward direction.

**Can I go back and un-complete a step I already marked Complete?**
Yes. Click the step, then click **Pending** in the status controls. The step will revert to Pending and the completed timestamp will be cleared. However, if steps after it are already In Progress or Complete, the app will show a warning message. It will not block you or undo those later steps — it just flags the inconsistency so you are aware.

**A step has been Blocked for a while. How do I clear it?**
Open the blocked step, then click **In Progress** or **Pending** in the status controls. The app will automatically move the blocked reason into the step's notes (so you have a permanent record of why it was blocked) and clear the block. The step is now active again.

**I want to mark a step In Progress even though the step before it is not done yet. Can I do that?**
Yes. In Progress has no sequence restriction. You can mark any step In Progress at any time. Only the **Complete** status is sequentially enforced.

**What does the "Next Action" banner on each project card tell me?**
It tells you what your very next action should be on that project — the lowest-numbered step that is not yet Complete, and a brief instruction about what it involves. Think of it as the app tapping you on the shoulder and saying: "This is where you left off."

**The prompts in every step still say PLACEHOLDER. When will they show real content?**
The real prompts need to be authored by you and embedded in the application code. This is the single most important pending task after deployment. The app is fully functional for tracking — it just cannot yet hand you the ready-made Claude prompt for each step. See the technical section below for how to approach this.

---

## Data, Backup, and Recovery

**How often should I export a backup?**
At the end of every working session. It takes two seconds — click **↑ Export**, save the file. Keep the last three exports. That is the whole backup strategy.

**Where should I save my backup files?**
Somewhere that is not only on this computer. A folder in Google Drive or Dropbox is ideal. If your laptop breaks, you want to be able to open your backup file on a different machine and restore everything immediately.

**I accidentally clicked Import and it wiped my current data. Can I undo?**
If you confirmed the import, the previous data has been overwritten. There is no undo. However, if you exported before importing (which the confirmation warning encouraged you to do), you can simply import that backup to restore what you had. If you had no backup, the previous data is gone.

This is the exact reason the import flow shows a prominent warning before allowing confirmation — always read it.

**I cleared my browser data / cookies and lost all my projects. What can I do?**
If you have an export file, import it and you are fully restored. If you do not have an export file, the data cannot be recovered — it was only in your browser's local storage, which has now been cleared. Start fresh and commit to exporting after every session going forward.

**I want to use the app on my laptop and my desktop. How do I sync between them?**
The app has no cloud sync. The way to work across devices is: export on one device, transfer the backup file (email it to yourself, put it in Dropbox, etc.), then import on the other device. You will always be working from the most recent export — not a live sync, but reliable.

**How large do the backup files get?**
Very small. Even with a dozen projects and extensive notes in every step, you are unlikely to exceed a few hundred kilobytes. The files are plain JSON text. They open in any text editor if you ever want to inspect them.

**What happens if my backup file is corrupted or from a different version of the app?**
The app validates every import file before accepting it. If the file is corrupted, malformed, or from an incompatible version, it will be rejected with an error message and your current data will be left completely untouched. You cannot accidentally destroy your data with a bad import file.

---

## Troubleshooting

**The app shows a friendly error page instead of my dashboard. What happened?**
Something unexpected went wrong during loading — usually this means the stored data has become corrupted in an unusual way. The error page has a **Reload App** button. Try that first. If the error reappears, the safest path is: (1) open your most recent backup file, (2) note the contents if you need any recent data, (3) use DevTools to manually clear the `iw-data` key from local storage, (4) reload the app, (5) import your backup.

If you are not comfortable with DevTools, you can clear all site data for the GitHub Pages URL in your browser settings — this will also clear your data, so only do it if you have a backup.

**The Copy Prompt button is not working. The prompt does not paste.**
This is almost always a browser permission issue. The clipboard API requires the page to be served over HTTPS (which it is) and for the browser to have clipboard permission. Try: (1) click somewhere on the page first to ensure the page has focus, (2) then try the button or the keyboard shortcut (Ctrl+Shift+C / Cmd+Shift+C). If it still fails, check your browser's site permissions for the GitHub Pages URL and ensure clipboard access is allowed.

**The timer on a step seems to have reset to zero after I closed and reopened the browser.**
The timer saves its accumulated time when you change a step's status and also when you close the browser tab (via a page-close handler). If the timer appears to have reset, check whether the step is still set to In Progress — it is possible the status was inadvertently changed. The accumulated seconds are stored in the data; they do not reset unless the step record is modified.

**The step I want to complete is still greyed out even though I think all the previous steps are done.**
Check steps 5 and 6 specifically — both must be Complete before step 7 can be completed. Also double-check that the step immediately before yours is marked Complete (not just In Progress). The app enforces strict sequencing: the green checkmark must be present on every prior step, not just blue or amber indicators.

**A project is not showing on my dashboard.**
If you cannot find a project, check the Archived view (click **Archived** on the Dashboard). If you archived a project accidentally, click **Restore** next to it and it will return to your active dashboard. If you deleted it, it is gone permanently.

**The app loaded but all my project cards seem to show zero progress, even though I had been working on them.**
This usually means the app loaded fresh data rather than your stored data — which typically means you are on a different browser or device than usual. Check you are using the right browser, and if your bookmarked URL is correct. If you are in the right place and data is still missing, import your most recent backup.

---

## Prompts and Claude Sessions

**The prompts all say PLACEHOLDER. How do I actually use the app for building?**
Until real prompts are authored and embedded in the code, the app works as a tracker only. You can still use it to mark steps complete, take notes, and follow your progress. For the actual Claude sessions, you will use your system prompt document separately. The prompt authoring task is the next major piece of work after deployment.

**How do I author the real prompts and get them into the app?**
This involves editing the file `/src/data/steps.js` in your GitHub repository and replacing each `prompt_text` placeholder with the real prompt. The process is: (1) open Claude Web, (2) draft each prompt using your knowledge of what each step needs to achieve, (3) run a quality check on all 24 prompts in a single Claude session to verify they invoke the right persona and reference the right documents, (4) edit `steps.js` in VS Code, (5) rebuild and redeploy. This is a future V1.0 completion task — not a V1.1 feature.

**Can I edit the prompt in the app before copying it?**
No. The prompt text is read-only in the app — this is intentional. The idea is that prompts are vetted and reliable before being embedded. You can copy the prompt, then edit your local copy in a text editor before pasting it into Claude. The app's copy button just gets it to your clipboard; what you do with it from there is up to you.

**I want to add context to a prompt before sending it to Claude. How?**
Copy the prompt to your clipboard (Copy Prompt button or Ctrl+Shift+C), paste it into a text editor or directly into Claude's message box, add your extra context, then send. The app has no involvement in what happens inside Claude — it just holds and delivers the base prompt.

---

## Project Management

**Can I have two projects with the same name?**
Yes. The app does not enforce unique project names. Each project has a unique internal ID regardless of name. If you have two projects with the same name, give them different descriptions to tell them apart, or rename one of them.

**I want to start a new project using the same framework. Do I create a new project or duplicate an existing one?**
Create a new project. Duplicate is for cases where you want to use one specific project's structure as a starting template with different settings. For a fresh project using the same standard 24-step process, simply create new — the 24 steps are always the same and always reset to Pending regardless.

**I have completed a project. Should I archive or delete it?**
Archive it. There is no reason to delete a completed project — the data takes up almost no space, and archived projects are valuable references. You can look back at the notes you took, the time you spent on each step, and the decisions you made. Delete is for projects that were created by mistake and have no useful data in them.

**I want to use the app for a type of project that does not fit the 24-step framework. Can I?**
The 24 steps are fixed and cannot be changed from within the app. The app is designed specifically for your AI-assisted software development framework. If you want to track a different type of project, you would either need to repurpose step names in your mind (not ideal) or consider V1.1 development to support custom step definitions.

---

*End of user-faq.md — Implementation Wizard v1.0*
