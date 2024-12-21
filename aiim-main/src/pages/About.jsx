const data = [
  {
    img: "/ethan.jpeg",
    name: "Ethan Lowder",
    role: "Co-Founder",
    school: "Harvard Medical School",
    email: "ethanlowder@hms.harvard.edu",
  },
  {
    img: "/pema.jpeg",
    name: "Pema Childs",
    role: "Co-Founder",
    school: "Washington University in St. Louis",
    email: "c.pema@wustl.edu",
  },
  {
    img: "/shiv.png",
    name: "Shiv Patel",
    role: "Co-Founder",
    school: "Florida State University",
    email: "shiv.patel@med.fsu.edu",
  },
];

const PersonCard = ({ img, name, role, school, email }) => {
  return (
    <div className="flex flex-col ">
      <img
        src={img}
        alt={name}
        className="rounded-full w-[130px] mb-5 object-cover object-top aspect-[1/1]"
      />
      <span className="font-bold">{name}</span>
      <span>{role}</span>
      <span>{school}</span>
      <span className="underline">{email}</span>
    </div>
  );
};

const About = () => {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="px-page font-bold text-2xl pt-5">The Team</h1>
      <div className="px-page grid grid-cols-3 gap-4">
        {data.map((person) => (
          <PersonCard key={person.email} {...person} />
        ))}
      </div>
    </div>
  );
};

export default About;

