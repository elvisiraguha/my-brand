import ProfileInfo from "../models/ProfileInfo.model";

ProfileInfo.deleteOne({type: 'info'});

const info = new ProfileInfo({
	type: "info",
	address: "Kigali, Rwanda",
	email: "iraguhaelvis@gmail.com",
	intro:
		"I am a Passionate Web Developer who Aims at Excellency and Believe in Web Accessibility for All.",
	phone: "+250783984662",
	subTitle: "Full-Stack Web Developer",
	title: "Elvis Iraguha",
});

info.save();
