export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">About Brown Course Scheduler</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">What is Course Scheduler?</h2>
        <p>
          Course Scheduler is a web application designed to help Brown University students search for, organize, and plan their academic schedules efficiently. 
        Users can explore available courses, add them to a visual calendar, share schedules with friends, and download their finalized course cart to export into their personal calendar.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Search and filter Brown University courses</li>
          <li>Add courses to a personal calendar view</li>
          <li>Export schedule to Google Calendar</li>
          <li>Friends system with schedule sharing</li>
          <li>Persistent authentication and secure login</li>
        </ul>
      </section>

    

      <section>
  <h2 className="text-2xl font-semibold mb-2">About the Developer</h2>
  <p className="mb-4">
    This project was built by Nicholas Romero, a student who got tired of manually copying course times into his personal calendar every semester. 
  </p>
  <p>
    For any questions, suggestions or to report a bug, feel free to send an email to <a href="mailto:nromero4792@gmail.com" className="text-blue-600 underline">nromero4792@gmail.com</a>.
  </p>
</section>

    </div>
  );
}
