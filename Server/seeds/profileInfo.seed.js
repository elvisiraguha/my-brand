import ProfileInfo from "../models/ProfileInfo.model";

const info = new ProfileInfo({
	type: "info",
	address: "Kigali, Rwanda",
	email: "iraguhaelvis@gmail.com",
	intro:
		"I am a Passionate Web Developer who Aims at Excellency and Believe in Web Accessibility for All.",
	phone: "+250783984662",
	profileImageUrl:
		"https://firebasestorage.googleapis.com/v0/b/my-brand-96113.appspot.com/o/8%2Fmyprofile.png?alt=media&token=5bc89c6d-083a-4c6b-a775-cd8302eecb3b",
	subTitle: "Full-Stack Web Developer",
	title: "Elvis Iraguha",
});

ProfileInfo.deleteMany({ type: "info" }, () => {
	info.save();
});
