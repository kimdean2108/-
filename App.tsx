
import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight,
  MessageSquare,
  X,
  Send,
  GraduationCap,
  Building2,
  Trophy,
  Lock,
  LayoutDashboard,
  LogOut,
  Users,
  Settings,
  Plus,
  BarChart3,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { askAIAboutProfile } from './services/geminiService';
import { Message } from './types';

const App: React.FC = () => {
  // Navigation & Admin State
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // UI State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '안녕하세요! 김경수 강사님의 프로필에 대해 궁금한 점이 있으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Track active section on scroll
  useEffect(() => {
    if (view !== 'public') return;
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', 
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'about', 'experience', 'lectures', 'goals', 'contact'];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [view]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAIAboutProfile(input);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "연결 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    if (view !== 'public') {
      setView('public');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) window.scrollTo({ top: element.offsetTop - 64, behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 64; 
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: id === 'home' ? 0 : elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '2108') {
      setIsAdminLoggedIn(true);
      setLoginError(false);
      setAdminPassword('');
    } else {
      setLoginError(true);
      setAdminPassword('');
    }
  };

  const navLinks = [
    { id: 'about', label: '소개' },
    { id: 'experience', label: '경력' },
    { id: 'lectures', label: '강의' },
    { id: 'goals', label: '2026 비전' },
    { id: 'contact', label: '연락처' },
  ];

  // --- Admin Components ---
  const AdminLoginScreen = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-pretendard">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-sky-600"></div>
        <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Lock className="text-sky-600" size={32} />
        </div>
        <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Admin Panel</h2>
        <p className="text-slate-500 text-center text-[11px] font-medium mb-10 opacity-70">보안을 위해 관리자 비밀번호를 입력하세요.</p>
        
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div className="relative">
            <input 
              type="password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className={`w-full px-6 py-5 bg-slate-50 border ${loginError ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-center text-3xl tracking-[0.6em] font-black`}
              placeholder="••••"
              autoFocus
            />
            {loginError && <p className="text-red-500 text-[10px] mt-4 text-center font-bold animate-shake">비밀번호가 올바르지 않습니다. (2108)</p>}
          </div>
          <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all text-[12px] uppercase tracking-widest shadow-xl shadow-slate-200">
            Login Now
          </button>
          <button 
            type="button" 
            onClick={() => setView('public')}
            className="w-full text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] hover:text-sky-600 transition-colors"
          >
            ← Back to Portfolio
          </button>
        </form>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="min-h-screen bg-slate-50 flex font-pretendard" style={{ fontSize: '0.8rem' }}>
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-10 text-xl font-black tracking-tighter text-sky-400 border-b border-white/5">ADMIN CONSOLE</div>
        <nav className="flex-1 p-6 space-y-3 mt-4">
          <button className="w-full flex items-center gap-4 px-5 py-4 bg-sky-600 rounded-2xl font-black">
            <LayoutDashboard size={18} /> 대시보드
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 rounded-2xl text-slate-400 font-bold transition-all">
            <BookOpen size={18} /> 강의 관리
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 rounded-2xl text-slate-400 font-bold transition-all">
            <Users size={18} /> 문의함 <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-[8px]">3</span>
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 rounded-2xl text-slate-400 font-bold transition-all">
            <Settings size={18} /> 설정
          </button>
        </nav>
        <div className="p-8">
          <button 
            onClick={() => { setIsAdminLoggedIn(false); setView('public'); }}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-2xl font-black uppercase tracking-widest transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-16 overflow-y-auto">
        <header className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">강사님 환영합니다!</h1>
            <p className="text-slate-500 mt-2 font-medium">김경수 강사님의 포트폴리오 사이트 현황입니다.</p>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-3 px-8 py-4 bg-sky-600 text-white rounded-2xl font-black shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all">
               <Plus size={18} /> 새 강의 등록
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: '누적 방문자', value: '1,429', icon: <BarChart3 size={20}/>, color: 'sky' },
            { label: '신규 문의', value: '3', icon: <MessageSquare size={20}/>, color: 'emerald' },
            { label: '등록된 강의', value: '10', icon: <BookOpen size={20}/>, color: 'indigo' },
            { label: '강사 평점', value: '4.9', icon: <Award size={20}/>, color: 'amber' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-6 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div className="text-slate-400 font-black uppercase tracking-widest mb-2" style={{ fontSize: '9px' }}>{stat.label}</div>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-lg">최근 수강 문의</h3>
              <button className="text-sky-600 font-black uppercase tracking-widest hover:underline" style={{ fontSize: '9px' }}>모두 보기</button>
            </div>
            <div className="p-6">
              {[
                { name: '사하구 경제지원센터', msg: '시니어 AI 기초 강의 정규 편성 문의', status: '대기중', time: '10분 전' },
                { name: 'DB손해보험 홍보팀', msg: '마케팅 실무 AI 활용법 워크숍 요청', status: '진행중', time: '1시간 전' },
                { name: '개인 수강생 (이은주)', msg: '나노바나나 이미지 생성 기법 추가 질문', status: '완료', time: '어제' }
              ].map((item, i) => (
                <div key={i} className="px-4 py-5 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-sky-100 group-hover:text-sky-600 transition-all">
                      {item.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{item.msg}</div>
                      <div className="text-slate-400 font-medium" style={{ fontSize: '9px' }}>{item.name} • {item.time}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-black uppercase tracking-tighter text-white ${
                    item.status === '대기중' ? 'bg-amber-500' : 
                    item.status === '진행중' ? 'bg-sky-500' : 'bg-emerald-500'
                  }`} style={{ fontSize: '8px' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-lg">강의 스케줄</h3>
              <Calendar size={20} className="text-slate-300" />
            </div>
            <div className="p-10">
               <div className="space-y-8">
                 {[
                   { date: '03.24', title: '부산대학교 회계학과 홈커밍 AI 특강', time: '14:00' },
                   { date: '03.28', title: '시니어 디지털 리터러시 4주차 (사하)', time: '10:00' },
                   { date: '04.05', title: '보험 마케팅팀 ChatGPT 실무 활용 전파', time: '13:00' }
                 ].map((schedule, i) => (
                   <div key={i} className="flex gap-8 items-start relative group">
                     {i < 2 && <div className="absolute left-4 top-10 w-0.5 h-12 bg-slate-100"></div>}
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-slate-200">
                        <div className="font-black" style={{ fontSize: '10px' }}>{schedule.date}</div>
                     </div>
                     <div className="flex-1">
                        <div className="font-bold text-slate-800">{schedule.title}</div>
                        <div className="flex items-center gap-2 text-slate-400 mt-1 font-medium" style={{ fontSize: '9px' }}>
                          <Clock size={10} /> {schedule.time}
                        </div>
                     </div>
                     <CheckCircle2 size={16} className="text-slate-100 group-hover:text-emerald-500 transition-colors cursor-pointer" />
                   </div>
                 ))}
               </div>
               <button className="w-full mt-12 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all" style={{ fontSize: '10px' }}>
                 + 새로운 일정 추가
               </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );

  // Router logic
  if (view === 'admin') {
    return isAdminLoggedIn ? <AdminDashboard /> : <AdminLoginScreen />;
  }

  // --- Public Site UI ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-pretendard">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('home')} 
            className="font-black text-xl text-sky-600 tracking-tight cursor-pointer focus:outline-none"
          >
            Kim Kyeongsu PORTFOLIO
          </button>
          <div className="hidden md:flex space-x-12">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-all duration-300 relative py-1 focus:outline-none font-black uppercase tracking-tight ${
                  activeSection === link.id 
                  ? 'text-sky-600 underline decoration-2 underline-offset-8 scale-105' 
                  : 'text-slate-900 hover:text-sky-500'
                }`}
                style={{ fontSize: '120%' }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-24 pb-12 overflow-hidden bg-gradient-to-b from-sky-50 to-white min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center w-full">
          <div className="lg:w-1/2 z-10 py-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-black uppercase tracking-[0.2em] mb-8" style={{ fontSize: '80%' }}>
              <Cpu className="w-4 h-4 mr-2" /> AI Education Specialist
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-10 tracking-tighter">
              <span className="text-sky-600">테두리 없는 삶</span>으로 <br/>
              항상 새로운 일을 모색합니다 
            </h1>
            <p className="text-slate-600 leading-relaxed mb-12 max-w-xl opacity-90 font-medium" style={{ fontSize: '80%' }}>
              30년간의 보험업계 리더 경험 후, AI 전파자로서 부산지역 경제교육센터와 
              다양한 공공기관에서 활동 중입니다. 
              단순한 이해를 넘어 실무 활용의 수준까지 도달하도록 돕습니다.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
                style={{ fontSize: '80%' }}
              >
                강의 문의하기
              </button>
              <button 
                onClick={() => scrollToSection('lectures')}
                className="px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                style={{ fontSize: '80%' }}
              >
                커리큘럼 보기
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full h-[400px] lg:h-[550px] relative mt-16 lg:mt-0 px-4">
            <div className="absolute inset-0 bg-sky-300/10 rounded-[60px] blur-3xl -z-10 animate-pulse"></div>
            <iframe 
              src='https://my.spline.design/genkubgreetingrobot-NVc52IGo3BWuUewUfwwa5tUL/' 
              frameBorder='0' 
              width='100%' 
              height='100%'
              className="rounded-[40px] shadow-2xl"
              title="Greeting Robot"
            ></iframe>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="scroll-mt-20">
            <h2 className="text-3xl font-black mb-12 flex items-center tracking-tight">
              <GraduationCap className="mr-4 text-sky-600" /> 교육 및 전문 자격
            </h2>
            <div className="space-y-6">
              <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 group hover:bg-sky-50 transition-colors">
                <h3 className="font-black text-xl mb-1 tracking-tight">부산대학교 회계학과</h3>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em]" style={{ fontSize: '80%' }}>1982년 입학 / 학사 졸업</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { title: 'AI / OA 강사', desc: '시니어티처 / 챗GPT활용 지도사', bg: 'bg-sky-50', text: 'text-sky-800' },
                  { title: '전문 상담가', desc: 'MBTI 학습진로 상담지도사', bg: 'bg-slate-50', text: 'text-slate-800' },
                  { title: '농업 및 문화', desc: '유기농업기능사 / 문화 자산해설사', bg: 'bg-slate-50', text: 'text-slate-800' },
                  { title: '기타 전문', desc: '무인멀티곱터 3종 / 바리스타 1급', bg: 'bg-slate-50', text: 'text-slate-800' }
                ].map((item, i) => (
                  <div key={i} className={`p-6 ${item.bg} rounded-3xl border border-transparent hover:border-sky-200 transition-all`}>
                    <p className={`font-black mb-2 ${item.text}`} style={{ fontSize: '100%' }}>{item.title}</p>
                    <p className="text-slate-500 font-bold" style={{ fontSize: '75%' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-black mb-12 tracking-tight">교육 철학</h2>
            <div className="relative p-12 bg-sky-600 rounded-[50px] text-white shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <TrendingUp size={150} />
              </div>
              <p className="text-xl font-light leading-relaxed italic mb-10 relative z-10" style={{ fontSize: '110%' }}>
                "시니어와 실무자들이 AI를 두려워하지 않고, 
                오늘 배워 오늘 바로 업무와 삶에 적용할 수 있는 
                살아있는 지식을 전달합니다."
              </p>
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Trophy size={28} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight">실무 중심 교육 전문가</p>
                  <p className="text-sky-100 font-black uppercase tracking-[0.2em]" style={{ fontSize: '65%' }}>AI & Economy Bridge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-20 text-center tracking-tight">30년 경력의 전문가적 통찰</h2>
          <div className="max-w-4xl mx-auto space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-12 h-12 rounded-[20px] border-4 border-white bg-slate-900 text-white shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-transform group-hover:scale-110">
                <Building2 size={20} />
              </div>
              <div className="w-[calc(100%-5rem)] md:w-[45%] p-10 rounded-[45px] border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-black text-slate-900 text-xl">DB손해보험 (구 동부화재)</div>
                  <time className="font-black text-sky-600 tracking-[0.2em] uppercase" style={{ fontSize: '70%' }}>1990 - 2020</time>
                </div>
                <p className="text-slate-700 font-black mb-6 uppercase tracking-widest" style={{ fontSize: '80%' }}>부산본부 본부장 및 교육팀장 역임</p>
                <p className="text-slate-500 leading-relaxed font-medium" style={{ fontSize: '85%' }}>수많은 설계사와 관리자를 교육하며 현장의 언어를 학습했습니다. 이는 곧 AI라는 복잡한 기술을 가장 쉽게 풀어내는 밑거름이 되었습니다.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-12 h-12 rounded-[20px] border-4 border-white bg-sky-600 text-white shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-transform group-hover:scale-110">
                <BookOpen size={20} />
              </div>
              <div className="w-[calc(100%-5rem)] md:w-[45%] p-10 rounded-[45px] border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-black text-slate-900 text-xl">공인 경제 & AI 강사</div>
                  <time className="font-black text-sky-600 tracking-[0.2em] uppercase" style={{ fontSize: '70%' }}>2021 - Present</time>
                </div>
                <p className="text-slate-700 font-black mb-6 uppercase tracking-widest" style={{ fontSize: '80%' }}>부산지역 경제교육센터 & 휴먼북</p>
                <p className="text-slate-500 leading-relaxed font-medium" style={{ fontSize: '85%' }}>시니어 디지털 리터러시, 중고등 경제 조기 교육, 기업 대상 프롬프트 엔지니어링 등 폭넓은 스펙트럼의 강의를 수행하고 있습니다.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lectures Section */}
      <section id="lectures" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-5 tracking-tight">Main Curriculums</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em]" style={{ fontSize: '65%' }}>실용성에 집중한 프리미엄 콘텐츠</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-12 rounded-[50px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl transition-all group-hover:bg-sky-500/20"></div>
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-sky-500/20 rounded-2xl flex items-center justify-center"><Cpu size={20} className="text-sky-400" /></div>
                 AI 테크놀로지
              </h3>
              <ul className="space-y-5">
                {["챗GPT 실무 활용 (기초/심화)", "프롬프트 엔지니어링 바이블", "NotebookLM 지식 관리법", "나노바나나 이미지 생성 마스터", "AI 리터러시 전파 교육"].map((t, i) => (
                  <li key={i} className="flex items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors" style={{ fontSize: '90%' }}>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-sky-500 text-[10px] font-black mr-5 shrink-0">{i+1}</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-12 rounded-[50px] bg-sky-50 border border-sky-100 relative overflow-hidden group">
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-2xl shadow-md flex items-center justify-center"><TrendingUp size={20} className="text-sky-600" /></div>
                 경제 & 라이프
              </h3>
              <ul className="space-y-5">
                {["보험업계 대상 AI 실전 마케팅", "시니어 맞춤형 스마트 금융 자산", "취약계층 금융 사고 예방 특강", "초중고 경제/금융 꿈나무 교육", "은퇴자를 위한 디지털 비즈니스"].map((t, i) => (
                  <li key={i} className="flex items-center p-5 bg-white rounded-2xl border border-sky-200/50 shadow-sm hover:border-sky-400 transition-colors" style={{ fontSize: '90%' }}>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-900 text-[10px] text-white font-black mr-5 shrink-0">{i+1}</span>
                    <span className="text-slate-800 font-bold">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50 rounded-[60px] p-12 md:p-20 flex flex-col lg:flex-row gap-20 border border-slate-100 shadow-inner">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-black mb-10 tracking-tight">협업 및 교육 제안</h2>
              <p className="text-slate-500 mb-14 font-medium leading-relaxed" style={{ fontSize: '85%' }}>새로운 도전은 언제나 환영합니다. <br/>강의 의뢰, 자문, 파트너십 제안 등 궁금한 점이 있으시면 남겨주세요.</p>
              <div className="space-y-10">
                <div className="flex items-center group cursor-pointer">
                  <div className="w-16 h-16 bg-sky-100 rounded-3xl flex items-center justify-center mr-8 group-hover:bg-sky-600 transition-all"><Phone size={24} className="text-sky-600 group-hover:text-white" /></div>
                  <div><p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">Phone</p><p className="text-xl font-black tracking-tight">010-8739-7090</p></div>
                </div>
                <div className="flex items-center group cursor-pointer">
                  <div className="w-16 h-16 bg-sky-100 rounded-3xl flex items-center justify-center mr-8 group-hover:bg-sky-600 transition-all"><Mail size={24} className="text-sky-600 group-hover:text-white" /></div>
                  <div><p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">Email</p><p className="text-xl font-black tracking-tight">kksu2108@gmail.com</p></div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100">
              <h3 className="text-xl font-black mb-10 tracking-tight">Send Message</h3>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input type="text" placeholder="성함" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-500 transition-all" style={{ fontSize: '85%' }} />
                  <input type="email" placeholder="이메일" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-500 transition-all" style={{ fontSize: '85%' }} />
                </div>
                <textarea rows={5} placeholder="문의하실 내용을 입력해주세요." className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-sky-500 transition-all" style={{ fontSize: '85%' }}></textarea>
                <button className="w-full py-6 bg-sky-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all transform active:scale-95" style={{ fontSize: '80%' }}>
                  전송하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sky-600 font-black text-[12px] tracking-[0.4em] uppercase mb-10">Kim Kyeongsu | AI Education Master</div>
          <div className="flex justify-center gap-6 mb-12">
            <button 
              onClick={() => setView('admin')} 
              className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-sky-600 border border-slate-100 px-8 py-3 rounded-full transition-all hover:bg-sky-50 shadow-sm"
            >
              ADMIN PANEL ACCESS
            </button>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2024 Kim Kyeongsu. All Rights Reserved.</p>
        </div>
      </footer>

      {/* AI Assistant */}
      <div className="fixed bottom-10 right-10 z-[60]">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="w-20 h-20 bg-slate-900 text-white rounded-[30px] flex items-center justify-center shadow-2xl hover:scale-110 hover:rotate-6 transition-all animate-bounce hover:animate-none"
          >
            <MessageSquare size={28} />
          </button>
        ) : (
          <div className="w-96 bg-white rounded-[45px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-7 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-4 text-[12px] font-black uppercase tracking-widest">
                <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg"><Cpu size={20} /></div>
                <span>AI Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-colors"><X size={24} /></button>
            </div>
            <div className="h-[450px] overflow-y-auto p-8 space-y-6 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[28px] leading-relaxed font-bold ${
                    m.role === 'user' ? 'bg-sky-600 text-white shadow-xl shadow-sky-100' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                  }`} style={{ fontSize: '80%' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl w-fit animate-pulse text-[10px] font-black italic text-slate-300">Generating Answer...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                placeholder="강사님에게 질문하세요..." 
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[12px] font-bold outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
              />
              <button onClick={handleSendMessage} className="p-5 bg-sky-600 text-white rounded-2xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100">
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
