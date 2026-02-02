
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
  Trophy
} from 'lucide-react';
import { askAIAboutProfile } from './services/geminiService';
import { Message } from './types';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '안녕하세요! AI 교육 전문가의 프로필에 대해 궁금한 점이 있으신가요?' }
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
  }, []);

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
    const element = document.getElementById(id);
    if (element) {
      const offset = 64; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: id === 'home' ? 0 : offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { id: 'about', label: '소개' },
    { id: 'experience', label: '경력' },
    { id: 'lectures', label: '강의' },
    { id: 'goals', label: '2026 비전' },
    { id: 'contact', label: '연락처' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('home')} 
            className="font-black text-xl text-sky-600 tracking-tight cursor-pointer focus:outline-none"
          >
            Kim Kyeongsu PORTFOLIO
          </button>
          <div className="hidden md:flex space-x-8 text-sm font-bold">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-all duration-300 relative py-1 focus:outline-none ${
                  activeSection === link.id 
                  ? 'text-sky-600 underline decoration-2 underline-offset-4' 
                  : 'text-slate-700 hover:text-sky-500'
                }`}
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
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-6 animate-fade-in">
              <Cpu className="w-3.5 h-3.5 mr-2" /> AI Education Specialist
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
              <span className="text-sky-600">테두리 없는 삶</span>으로 <br/>
              항상 새로운 일을 모색합니다 
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              30년간의 회사 생활 퇴직 후, AI의 전파자로서 관련 강의와 
              부산지역 경제교육센터의 경제 강사로 활발히 활동 중입니다.
              단순한 이해를 넘어 <span className="font-bold text-slate-900 underline decoration-sky-400">실무 활용의 수준</span>까지 도달하도록 돕습니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                강의 문의하기
              </button>
              <button 
                onClick={() => scrollToSection('lectures')}
                className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
              >
                강의 커리큘럼 보기
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full h-[400px] lg:h-[500px] relative mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-sky-200/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <iframe 
              src='https://my.spline.design/genkubgreetingrobot-NVc52IGo3BWuUewUfwwa5tUL/' 
              frameBorder='0' 
              width='100%' 
              height='100%'
              className="rounded-3xl shadow-xl"
              title="Greeting Robot"
            ></iframe>
          </div>
        </div>
      </section>

      {/* About Section - Education & Intro */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <GraduationCap className="mr-2 text-sky-600" /> 교육 및 자격
            </h2>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg mb-1">부산대학교 회계학과</h3>
                <p className="text-slate-500 text-xs">1982년 입학</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-sky-50 rounded-xl">
                  <p className="font-bold text-sm text-sky-800">AI / OA 강사</p>
                  <p className="text-[10px] text-sky-600">시니어티처 / 챗GPT활용 지도사</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <p className="font-bold text-sm text-slate-800">전문 상담가</p>
                  <p className="text-[10px] text-slate-500">MBTI 학습진로 상담지도사</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <p className="font-bold text-sm text-slate-800">농업 및 문화</p>
                  <p className="text-[10px] text-slate-500">유기농업기능사 / 근대문화 자산해설사</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <p className="font-bold text-sm text-slate-800">기타 전문</p>
                  <p className="text-[10px] text-slate-500">무인멀티곱터 3종 / 바리스타 1급</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">교육 철학</h2>
            <div className="relative p-6 bg-sky-600 rounded-3xl text-white shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <TrendingUp size={100} />
              </div>
              <p className="text-lg font-light leading-relaxed italic mb-6">
                "시니어·퇴직 예정자·실무자들이 AI를 단순히 이해하는 수준이 아니라, 지금 바로 활용하는 수준까지 도달하도록 돕는 교육과 콘텐츠를 설계합니다."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-base">실무 중심 교육 전문가</p>
                  <p className="text-sky-100 text-[10px]">AI 교육 & 실무 활용 브릿지</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-12 text-center">30년 경력의 전문가</h2>
          <div className="max-w-3xl mx-auto space-y-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Building2 size={14} />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[45%] p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-slate-900 text-lg">DB손해보험 (구 동부화재)</div>
                  <time className="font-medium text-sky-600 text-[10px]">1990 - 2020</time>
                </div>
                <p className="text-slate-600 text-xs mb-3">교육팀 / 마케팅팀 핵심 리더</p>
                <ul className="text-[11px] text-slate-500 space-y-1.5">
                  <li className="flex items-start"><ChevronRight className="w-3 h-3 mr-2 text-sky-400 shrink-0 mt-0.5" /> 팀장 / 단장 / 부산본부 본부장 역임</li>
                  <li className="flex items-start"><ChevronRight className="w-3 h-3 mr-2 text-sky-400 shrink-0 mt-0.5" /> 진주, 제주, 부산 지역 마케팅 리딩</li>
                </ul>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-sky-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <BookOpen size={14} />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[45%] p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-slate-900 text-lg">전문 강사 활동</div>
                  <time className="font-medium text-sky-600 text-[10px]">2021 - Present</time>
                </div>
                <p className="text-slate-600 text-xs mb-3">AI 교육 및 경제 교육 스페셜리스트</p>
                <ul className="text-[11px] text-slate-500 space-y-1.5">
                  <li className="flex items-start"><ChevronRight className="w-3 h-3 mr-2 text-sky-400 shrink-0 mt-0.5" /> 부산지역 경제교육센터 경제 강사</li>
                  <li className="flex items-start"><ChevronRight className="w-3 h-3 mr-2 text-sky-400 shrink-0 mt-0.5" /> 시니어 대상 AI 리터러시 전파</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lectures Grid */}
      <section id="lectures" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">강의 콘텐츠</h2>
            <p className="text-slate-500 text-sm">시대가 요구하는 AI와 실물 경제를 아우르는 커리큘럼</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
              <div className="flex items-center mb-6">
                <div className="p-2.5 bg-sky-500/20 rounded-xl mr-3">
                  <Cpu size={20} className="text-sky-400" />
                </div>
                <h3 className="text-xl font-bold">AI 관련 강의 (휴먼북 강사)</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "챗GPT와 친구되기 (기초부터 심화까지)",
                  "프롬프트 엔지니어링의 정석",
                  "AI 나도 할 수 있다 (AI 실무 활용법)",
                  "노트북LM 실생활 활용 꿀팁",
                  "나노바나나로 이미지 생성 기법 마스터"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center p-3.5 bg-white/5 rounded-xl border border-white/10 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-sky-500 text-[8px] font-bold mr-3 shrink-0">{idx+1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-sky-50 border border-sky-100">
              <div className="flex items-center mb-6">
                <div className="p-2.5 bg-white rounded-xl mr-3 shadow-sm border border-sky-200">
                  <TrendingUp size={20} className="text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">경제 및 기타 특강</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "GA(보험법인)에서 활용 가능한 AI 실전팁",
                  "취약계층 금융사고 예방 및 보호 교육",
                  "시니어 대상 금융페이 & 연금 활용 교육",
                  "초중등학생 대상 맞춤형 금융 교육",
                  "스마트한 은퇴 설계를 위한 경제 지표 이해"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center p-3.5 bg-white rounded-xl border border-sky-200/50 shadow-sm text-sm">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-900 text-[8px] text-white font-bold mr-3 shrink-0">{idx+1}</span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2026 Goals */}
      <section id="goals" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-3 italic">Vision 2026</h2>
              <p className="text-slate-400 max-w-xl text-base">"AI로 여는 스마트한 인생"을 향한 네 가지 약속</p>
            </div>
            <div className="text-sky-400 font-mono text-lg">STEP BY STEP</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { 
                title: "비전 및 건강", 
                desc: "장시간 강의를 위한 철저한 체력 관리와 'AI 스마트 인생' 슬로건 전파",
                icon: <Trophy size={24} className="text-sky-400" />
              },
              { 
                title: "AI 학습 마스터", 
                desc: "GPT-5, Gemini 등 최신 모델 완벽 마스터 및 개인 지식 베이스 구축",
                icon: <Cpu size={24} className="text-sky-400" />
              },
              { 
                title: "퍼스널 브랜딩", 
                desc: "AI와 경제를 결합한 독보적인 통합 커리큘럼으로 브랜드 가치 강화",
                icon: <Award size={24} className="text-sky-400" />
              },
              { 
                title: "실행 프레임워크", 
                desc: "분기별 중점 과제와 매일 실천 체크리스트로 성과 가시화",
                icon: <Calendar size={24} className="text-sky-400" />
              }
            ].map((goal, idx) => (
              <div key={idx} className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="mb-5 group-hover:scale-110 transition-transform">{goal.icon}</div>
                <h4 className="text-lg font-bold mb-3">{goal.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{goal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50 rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row gap-12 shadow-inner border border-slate-100">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-black mb-6">연락처</h2>
              <p className="text-slate-500 mb-10 text-base">강의 문의나 협업 제안은 언제든 환영합니다.</p>
              <div className="space-y-6">
                <div className="flex items-center group">
                  <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center mr-5 group-hover:bg-sky-600 transition-colors">
                    <Phone size={18} className="text-sky-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Phone</p>
                    <p className="text-lg font-bold">010-8739-7090</p>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center mr-5 group-hover:bg-sky-600 transition-colors">
                    <Mail size={18} className="text-sky-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Email</p>
                    <p className="text-lg font-bold">kksu2108@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center mr-5 group-hover:bg-sky-600 transition-colors">
                    <MapPin size={18} className="text-sky-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Address</p>
                    <p className="text-lg font-bold leading-tight">부산시 사하구 낙동대로 263 <br/>105동 5042호</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-white p-7 rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-5">메시지 보내기</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">성함 / 단체명</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" placeholder="홍길동" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">이메일 주소</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" placeholder="example@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">문의 내용</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" placeholder="내용을 입력해주세요"></textarea>
                </div>
                <button type="submit" className="w-full py-3.5 bg-sky-600 text-white rounded-xl text-sm font-bold hover:bg-sky-700 transition-colors">
                  메시지 전송
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-sky-600 font-bold text-sm mb-3">Kim Kyeongsu | AI & ECONOMY EDUCATION</div>
          <p className="text-slate-400 text-[10px]">© 2024 AI Education Portfolio. All Rights Reserved.</p>
        </div>
      </footer>

      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-[60]">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-bounce"
          >
            <MessageSquare size={22} />
          </button>
        ) : (
          <div className="w-72 md:w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Cpu size={14} />
                </div>
                <span className="font-bold">AI 강사 비서</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/10 rounded-md">
                <X size={16} />
              </button>
            </div>
            
            <div className="h-72 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] ${msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-2.5 rounded-2xl flex gap-1 items-center">
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3.5 border-t border-slate-100 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="질문을 입력하세요"
                className="flex-1 bg-slate-100 border-none rounded-lg px-3 text-[11px] focus:ring-2 focus:ring-sky-500"
              />
              <button 
                onClick={handleSendMessage}
                className="p-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default App;
