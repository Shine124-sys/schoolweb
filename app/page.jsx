'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    AcademicCapIcon, UserGroupIcon, ChartBarIcon,
    BookOpenIcon, CalendarIcon, ShieldCheckIcon,
    ArrowRightIcon, CheckCircleIcon, StarIcon,
    MapPinIcon, PhoneIcon, EnvelopeIcon,
} from '@heroicons/react/24/outline';

const SCHOOL_NAME = 'Chenimari Bill Adarsha Jatiya Bidyalaya';
const SCHOOL_SHORT = 'CAJB';
const SCHOOL_LOCATION = 'Chenimari Bill, Assam';
const SCHOOL_PHONE = '+91 7002625472';
const SCHOOL_EMAIL = 'cajb019@gmail.com';

const FEATURES = [
    { icon: UserGroupIcon, title: 'Student Management', desc: 'Manage student profiles, class assignments, attendance records, and parent contact details with ease.' },
    { icon: AcademicCapIcon, title: 'Teacher Portal', desc: 'Teachers can manage classes, upload syllabuses, enter exam results, and share study notes.' },
    { icon: ChartBarIcon, title: 'Fee & Payments', desc: 'Integrated online fee collection with instant receipts and a complete payment ledger for every student.' },
    { icon: CalendarIcon, title: 'School Calendar', desc: 'School events, examination schedules, and holidays visible to all staff and parents in real time.' },
    { icon: BookOpenIcon, title: 'Digital Notes & Syllabus', desc: 'Teachers upload documents; students and parents access them instantly from any device.' },
    { icon: ShieldCheckIcon, title: 'Role-Based Access', desc: 'Separate, secure portals for Administrators, Teachers, and Parents — each with tailored access.' },
];

const STATS = [
    { label: 'Total Students', value: '500+' },
    { label: 'Academic Staff', value: '10+' },
    { label: 'Years of Service', value: '30+' },
    { label: 'Pass Rate', value: '98%' },
];

const TESTIMONIALS = [
    {
        name: 'Headmaster, CBAJB',
        role: 'School Administration',
        text: 'SchoolWeb has completely transformed how we manage daily operations. Fee collection, results, and communication are now seamless.'
    },
    {
        name: 'Senior Teacher',
        role: 'Teaching Staff, CBAJB',
        text: 'Uploading syllabus and entering exam results is now effortless. Parents can see their child\'s progress the same day.'
    },
    {
        name: 'Parent, Class VII',
        role: 'Guardian',
        text: 'I can check my child\'s results, fees balance, and upcoming events from my phone. This is a huge step forward for our school.'
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen font-sans">

            {/* ══════════ NAVBAR ══════════ */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/school_logo.jpeg" alt="School Logo" width={40} height={40} className="rounded-xl shadow" />
                        <div className="hidden sm:block">
                            <p className="font-bold text-slate-800 text-sm leading-tight">{SCHOOL_SHORT}</p>
                            <p className="text-xs text-slate-500 leading-tight">Adarsha Jatiya Bidyalaya</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#about" className="hover:text-green-600 transition-colors">About</a>
                        <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
                        <a href="#contact" className="hover:text-green-600 transition-colors">Contact</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-green-700 transition-colors px-4 py-2 rounded-lg hover:bg-green-50">
                            Staff Login
                        </Link>
                        <Link href="/register" className="text-sm font-semibold bg-gradient-to-br from-green-600 to-emerald-700 text-white px-5 py-2 rounded-xl hover:opacity-90 transition shadow-md shadow-green-200">
                            Register
                        </Link>
                    </div>
                </div>
            </header>

            {/* ══════════ HERO ══════════ */}
            <section className="relative overflow-hidden pt-32 pb-24 px-6">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-green-50 blur-3xl opacity-80 pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-50 blur-3xl opacity-80 pointer-events-none" />

                <div className="relative max-w-5xl mx-auto text-center">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-green-100">
                        <MapPinIcon className="w-3.5 h-3.5" /> {SCHOOL_LOCATION}
                    </span>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
                        {SCHOOL_NAME}
                    </h1>
                    <p className="text-lg md:text-xl text-green-700 font-semibold mb-6">
                       চেনীমাৰী বিল আদর্শ জাতীয় বিদ্যালয় — Run by A.K. FOUNDATION
                    </p>
                    <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Welcome to the official school management portal. Staff, teachers, and parents can manage student records, fees, exams, and more — all in one secure place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-br from-green-600 to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl hover:opacity-90 transition shadow-xl shadow-green-100 text-base">
                            Staff / Admin Login <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                        <Link href="/register" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-50 transition text-base">
                            Create Account
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
                        {STATS.map(({ label, value }) => (
                            <div key={label} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                                <p className="text-3xl font-extrabold text-green-700">{value}</p>
                                <p className="text-sm text-slate-500 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ ABOUT ══════════ */}
            <section id="about" className="py-24 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 p-1 shadow-2xl shadow-green-200">
                            <div className="bg-white rounded-[22px] p-8 space-y-4">
                                <div className="text-center mb-4 pb-4 border-b border-slate-100">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-3">
                                        <AcademicCapIcon className="w-9 h-9 text-green-700" />
                                    </div>
                                    <p className="font-bold text-slate-800">{SCHOOL_SHORT}</p>
                                    <p className="text-xs text-slate-500">{SCHOOL_LOCATION}</p>
                                </div>
                                {[
                                    { label: 'Enrolled Students', value: '500+', color: 'text-green-700' },
                                    { label: 'Teaching Faculty', value: '25+', color: 'text-emerald-700' },
                                    { label: 'Classes Running', value: 'I – XII', color: 'text-teal-700' },
                                    { label: 'Annual Pass Rate', value: '98%', color: 'text-green-700' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                        <span className="text-slate-500 text-sm">{label}</span>
                                        <span className={`font-bold text-lg ${color}`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">About Our School</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-5 leading-tight">
                            A centre of excellence in rural Assam
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-6">
                            Chenimari Bill Adarsha Jatiya Bidyalaya has been a pillar of education in the Chenimari Bill community for over three decades. We are committed to nurturing bright young minds through academic excellence, cultural values, and holistic development.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Affiliated to the Board of Secondary Education, Assam',
                                'Classes I to X with a focus on Assamese medium education',
                                'Dedicated faculty with deep community roots',
                                'Strong focus on Assamese language and cultural heritage',
                                'Digital portal for parents to track progress anytime',
                            ].map(item => (
                                <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ══════════ FEATURES ══════════ */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">School Portal Features</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-3">Everything in one place</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">Our digital portal connects administration, teachers, and parents for smooth and transparent school management.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="group p-6 rounded-2xl glass-card hover:shadow-xl transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition">
                                    <Icon className="w-6 h-6 text-green-700" />
                                </div>
                                <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ TEACHERS ══════════ */}
            <section id="teachers" className="py-24 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">Meet Our Faculty</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-3">Dedicated educators, inspiring futures</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">Our teachers bring years of experience and deep commitment to helping every student reach their full potential.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                photo: '/Principal.jpeg',
                                name: 'Taibur Rahman',
                                designation: 'Principal',
                                qualification: 'B.Sc | MSW | PGDCA',
                                subject: 'Administration',
                                experience: '5+ years',
                                about: 'With a strong foundation Mr Taibur Rahman leads the institution with a commitment to social responsibility and digital literacy. He is passionate about creating a disciplined yet nurturing atmosphere where students excel in both academics and character building.',
                                color: 'from-green-600 to-emerald-700',
                            },
                            {
                                photo: '/master.jpeg',
                                name: 'Husney Mubarak (Zubair) ',
                                designation: 'Senior Teacher',
                                qualification: 'B.Sc | D.Pharm',
                                subject: 'Mathematics & Science',
                                experience: '4+ years',
                                about: 'A passionate teacher whose students consistently achieve top marks in board examinations. Known for making complex concepts simple and engaging.His teaching philosophy focuses on clarity and engagement, helping students master the challenges of Mathematics and General Science with confidence and curiosity.',
                                color: 'from-teal-600 to-cyan-700',
                            },
                            {
                                photo: '/teacher_female_1.png',
                                name: 'Smt. Nirmala Kalita',
                                designation: 'Assistant Teacher',
                                qualification: 'B.A | B.Ed',
                                subject: 'Assamese & Social Science',
                                experience: '12+ years',
                                about: 'A nurturing educator who champions Assamese language and cultural heritage. Her lessons connect academics with the rich traditions of the local community.',
                                color: 'from-emerald-600 to-green-700',
                            },
                        ].map(({ photo, name, designation, qualification, subject, experience, about, color }) => (
                            <div key={name} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-green-50 transition-all duration-300 group">
                                {/* Photo */}
                                <div className={`relative bg-gradient-to-br ${color} h-56 flex items-end justify-center overflow-hidden`}>
                                    <img
                                        src={photo}
                                        alt={name}
                                        className="h-52 w-auto object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                {/* Info */}
                                <div className="p-6">
                                    <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">{designation}</p>
                                    <h3 className="font-bold text-slate-800 text-lg mb-0.5">{name}</h3>
                                    <h2 className="text-sm text-slate-500 mb-2">{qualification}</h2>
                                    <p className="text-sm text-slate-500 mb-3">{subject} · {experience}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">{about}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-slate-400 mt-10">+ 20 more dedicated staff members serving our students every day.</p>
                </div>
            </section>

            {/* ══════════ EXTRA ACTIVITIES ══════════ */}
            <section id="activities" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">Beyond the Classroom</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-3">Activities & School Services</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">We believe education is more than textbooks. Our students grow through a rich range of co-curricular activities and school services.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { emoji: '🏆', title: 'Annual Sports Day', desc: 'Inter-class athletics, team sports, and traditional Assamese games to build teamwork and fitness.' },
                            { emoji: '🎭', title: 'Cultural Programmes', desc: 'Bihu celebrations, drama, folk dance, and cultural evenings showcasing Assamese heritage.' },
                            { emoji: '📚', title: 'School Library', desc: 'A well-stocked library with Assamese, Bengali, Hindi, and English books for all classes.' },
                            { emoji: '🔬', title: 'Science Laboratory', desc: 'Fully equipped lab for practical experiments in Physics, Chemistry, and Biology.' },
                            { emoji: '🎨', title: 'Art & Craft Club', desc: 'Drawing, painting, and traditional Assamese handicraft sessions every week.' },
                            { emoji: '🌱', title: 'Eco & Nature Club', desc: 'Tree plantation drives, nature walks, and environmental awareness programmes.' },
                            { emoji: '📰', title: 'School Magazine', desc: 'Annual student-run magazine featuring essays, poems, news, and artwork.' },
                            { emoji: '🚌', title: 'Transport Service', desc: 'Safe and reliable school bus service covering surrounding villages and areas.' },
                        ].map(({ emoji, title, desc }) => (
                            <div key={title} className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-green-200 hover:shadow-lg hover:shadow-green-50 transition-all duration-200">
                                <div className="text-4xl mb-4">{emoji}</div>
                                <h3 className="font-semibold text-slate-800 mb-2 text-sm">{title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ TESTIMONIALS ══════════ */}
            <section className="py-24 px-6 bg-gradient-to-br from-green-700 to-emerald-800">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold text-white">Voices from our community</h2>
                        <p className="text-green-200 mt-3">What our staff and parents say about the portal.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map(({ name, role, text }) => (
                            <div key={name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />)}
                                </div>
                                <p className="text-sm leading-relaxed mb-5 text-green-100">"{text}"</p>
                                <div>
                                    <p className="font-semibold text-white text-sm">{name}</p>
                                    <p className="text-green-300 text-xs mt-0.5">{role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ CONTACT ══════════ */}
            <section id="contact" className="py-24 px-6 bg-slate-50">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
                    <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-8">Contact the School</h2>
                    <div className="grid sm:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <MapPinIcon className="w-6 h-6 text-green-700" />
                            </div>
                            <p className="font-semibold text-slate-800 text-sm">Address</p>
                            <p className="text-slate-500 text-sm text-center">{SCHOOL_LOCATION}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <PhoneIcon className="w-6 h-6 text-green-700" />
                            </div>
                            <p className="font-semibold text-slate-800 text-sm">Phone</p>
                            <p className="text-slate-500 text-sm">{SCHOOL_PHONE}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <EnvelopeIcon className="w-6 h-6 text-green-700" />
                            </div>
                            <p className="font-semibold text-slate-800 text-sm">Email</p>
                            <p className="text-slate-500 text-sm">{SCHOOL_EMAIL}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-br from-green-600 to-emerald-700 text-white font-semibold px-10 py-4 rounded-2xl hover:opacity-90 transition shadow-xl shadow-green-100 text-base">
                            Staff / Admin Login <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                        <Link href="/register" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-10 py-4 rounded-2xl hover:bg-slate-50 transition text-base">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════ FOOTER ══════════ */}
            <footer className="border-t border-slate-100 py-8 px-6 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                            <AcademicCapIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-xs">{SCHOOL_SHORT}</p>
                            <p className="text-slate-400 text-xs">{SCHOOL_LOCATION}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400">© {new Date().getFullYear()} {SCHOOL_NAME}. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <Link href="/login" className="hover:text-green-700 transition-colors">Login</Link>
                        <Link href="/register" className="hover:text-green-700 transition-colors">Register</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
