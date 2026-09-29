# College Club Events Platform

A fully responsive, full-stack web application designed for managing and displaying college club events. This platform serves both the student body (for discovering and registering for events) and club organizers (for creating events and managing attendees).

## 🚀 Key Features

### 1. Student/User Side (Public Facing)

**Home Page**
- **Club Introduction:** A welcoming hero section introducing the student developer community.
- **Featured Event:** Highlights the next major event with a real-time countdown timer and quick-access registration.
- **Upcoming Events Grid:** Displays a snapshot of other scheduled events.
- **Interactive FAQ:** Frequently asked questions in an interactive accordion format.

**Events Page**
- **List All Events:** A dedicated page displaying every upcoming event in the database.
- **Detailed Event Cards:** Each card clearly shows:
  - Event Name
  - Date & Time
  - Venue
  - Description
  - Registration Button
- **Search & Filter:**
  - **Search:** Real-time search bar to find events by name.
  - **Filter:** Category buttons (Workshop, Hackathon, Talk, Social) to filter the displayed events.

**Event Registration & Pass**
- **Dynamic Pass Preview:** A visual "Student Workshop Pass" that generates live as the user types.
- **Registration Form Data:** Captures:
  - Name (with live verification badge)
  - Email
  - College/Year (via Department dropdown and Year pill selectors)
  - Phone Number
  - Custom Workshop Preferences (e.g., catering, laptop requirements)
- **Submit Registration:** Saves data directly to the database and instantly updates the remaining capacity for the event.

**Fully Responsive Design**
- Mobile-first approach using Tailwind CSS.
- Sticky top navigation bar on desktop.
- App-style fixed bottom navigation bar on mobile devices.
- Seamlessly scales across phones, tablets, and desktop monitors.

### 2. Admin/Organizer Side (Protected)

**Secure Access**
- Password-protected login portal.
- Rate limiting implemented (max 5 attempts) to prevent brute-force attacks.

**Admin Dashboard**
- **Live Statistics:** 2x2 grid displaying Total RSVPs, Upcoming Events, and Average Turnout Percentage.
- **Event Management (CRUD):**
  - **Create:** Add new events (Name, Category, Date/Time, Venue, Description, Capacity).
  - **Read:** View all active events with visual progress bars showing registration capacity.
  - **Update/Edit:** Modify event details at any time.
  - **Delete:** Cancel events and remove associated data.
- **Attendee Management:**
  - Real-time stream of recent registrations.
  - Search through attendees by Name or Email.
  - Filter registrations by a specific event.
  - **Export to CSV:** One-click download of the attendee list for easy check-ins at the door.

---

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (via Neon)
- **ORM:** Prisma
- **Fonts & Assets:** Custom display fonts (Geist, Anton) and custom SVG/Emoji icons.

---

## 🛠️ Local Development Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory. You will need your PostgreSQL connection string and an admin password:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   ADMIN_PASSWORD="your_secure_password"
   ```

3. **Database Setup:**
   Generate the Prisma client and push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎵 Additional Configuration (Background Music)
To enable the interactive background music feature on the site, place a valid MP3 file named `theme.mp3` directly into the `/public/audio/` directory. The custom `<AudioToggle />` component will automatically detect the file and render the play/mute button on the screen.
