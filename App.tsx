
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
  CheckCircle2,
  MoreVertical,
  Trash2,
  Edit2,
  Globe,
  Bell
} from 'lucide-react';
import { askAIAboutProfile } from './services/geminiService';
import { Message } from './types';

type AdminTab = 'dashboard' | 'lectures' | 'inquiries' | 'settings';

const App: React.FC = () => {
  // Navigation & Admin State
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('dashboard');

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

  // --- Admin Screens ---

  const AdminLoginScreen = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-pretendard">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-sky-600"></div>
        <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Lock className="text-sky-600" size={32} />
        </div>
        <h2 className="text-2xl font-black text-center text-slate-900 mb-2 tracking-tight">Admin Portal</h2>
        <p className="text-slate-500 text-center text-[10px] font-bold uppercase tracking-widest mb-10 opacity-70">보안 관리자 인증</p>
        
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
            {loginError && <p className="text-red-500 text-[10px] mt-4 text-center font-bold">비밀번호가 올바르지 않습니다. (2108)</p>}
          </div>
          <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all text-[12px] uppercase tracking-widest shadow-xl shadow-slate-200">
            접속하기
          </button>
          <button 
            type="button" 
            onClick={() => setView('public')}
            className="w-full text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] hover:text-sky-600 transition-colors"
          >
            ← 포트폴리오 사이트로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );

  const AdminSidebar = () => (
    <aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-10 text-xl font-black tracking-tighter text-sky-400 border-b border-white/5 flex items-center gap-3">
        <Cpu size={24} /> ADMIN
      </div>
      <nav className="flex-1 p-6 space-y-2 mt-4">
        {[
          { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={18} /> },
          { id: 'lectures', label: '강의 관리', icon: <BookOpen size={18} /> },
          { id: 'inquiries', label: '문의 확인', icon: <Mail size={18} /> },
          { id: 'settings', label: '사이트 설정', icon: <Settings size={18} /> },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setCurrentAdminTab(item.id as AdminTab)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
              currentAdminTab === item.id ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <div className="p-8">
        <button 
          onClick={() => { setIsAdminLoggedIn(false); setView('public'); }}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  const DashboardContent = () => (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">대시보드</h1>
          <p className="text-slate-500 mt-2 font-medium" style={{ fontSize: '0.8rem' }}>김경수 강사님의 포트폴리오 운영 현황입니다.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500">
            <Calendar size={14} /> 2024년 03월 15일
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: '누적 방문자', value: '1,429', trend: '+12%', icon: <BarChart3 size={20}/>, color: 'sky' },
          { label: '신규 문의', value: '3', trend: 'New', icon: <Bell size={20}/>, color: 'emerald' },
          { label: '강의 리스트', value: '10', trend: 'Active', icon: <BookOpen size={20}/>, color: 'indigo' },
          { label: '전문가 평점', value: '4.9', trend: 'Excellent', icon: <Award size={20}/>, color: 'amber' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-6 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '9px' }}>{stat.label}</div>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-${stat.color}-100 text-${stat.color}-700`}>{stat.trend}</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-lg tracking-tight">실시간 문의 스트림</h3>
            <button className="text-sky-600 font-black uppercase tracking-widest hover:underline" style={{ fontSize: '9px' }}>전체 보기</button>
          </div>
          <div className="p-6">
            {[
              { name: '사하구 경제지원센터', msg: '시니어 AI 기초 강의 정규 편성 문의', status: '대기', time: '10분 전' },
              { name: 'DB손해보험 홍보팀', msg: '마케팅 실무 AI 활용법 워크숍 요청', status: '검토', time: '1시간 전' },
              { name: '최진우 수강생', msg: '프롬프트 엔지니어링 추가 자료 요청', status: '완료', time: '어제' }
            ].map((item, i) => (
              <div key={i} className="px-4 py-5 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black group-hover:bg-sky-100 group-hover:text-sky-600 transition-all">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-none mb-1" style={{ fontSize: '0.8rem' }}>{item.msg}</div>
                    <div className="text-slate-400 font-medium" style={{ fontSize: '9px' }}>{item.name} • {item.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full font-black uppercase tracking-tighter text-white ${
                    item.status === '대기' ? 'bg-amber-500' : 
                    item.status === '검토' ? 'bg-sky-500' : 'bg-emerald-500'
                  }`} style={{ fontSize: '8px' }}>
                    {item.status}
                  </span>
                  <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-lg tracking-tight">예정된 강의 일정</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"><Plus size={16} /></button>
            </div>
          </div>
          <div className="p-10">
             <div className="space-y-8">
               {[
                 { date: '03.24', title: '부산대학교 회계학과 홈커밍 AI 특강', time: '14:00', loc: '부산대학교' },
                 { date: '03.28', title: '시니어 디지털 리터러시 4주차 (사하)', time: '10:00', loc: '사하구청' },
                 { date: '04.05', title: '보험 마케팅팀 ChatGPT 실무 활용 전파', time: '13:00', loc: 'DB손해보험 본사' }
               ].map((schedule, i) => (
                 <div key={i} className="flex gap-8 items-start relative group">
                   {i < 2 && <div className="absolute left-4 top-10 w-0.5 h-12 bg-slate-100"></div>}
                   <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-slate-200 group-hover:bg-sky-600 transition-colors">
                      <div className="font-black" style={{ fontSize: '10px' }}>{schedule.date}</div>
                   </div>
                   <div className="flex-1">
                      <div className="font-bold text-slate-800" style={{ fontSize: '0.8rem' }}>{schedule.title}</div>
                      <div className="flex items-center gap-4 text-slate-400 mt-1 font-medium" style={{ fontSize: '9px' }}>
                        <span className="flex items-center gap-1"><Clock size={10} /> {schedule.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} /> {schedule.loc}</span>
                      </div>
                   </div>
                   <CheckCircle2 size={16} className="text-slate-100 group-hover:text-emerald-500 transition-colors cursor-pointer" />
                 </div>
               ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );

  const LectureManagementContent = () => (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">강의 관리</h1>
          <p className="text-slate-500 mt-2 font-medium" style={{ fontSize: '0.8rem' }}>커리큘럼을 수정하거나 새로운 강의 주제를 추가합니다.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-sky-600 text-white rounded-2xl font-black shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all text-[11px] uppercase tracking-widest">
          <Plus size={18} /> 새 강의 등록
        </button>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">카테고리</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">강의 주제</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">수준</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">상태</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { cat: 'AI 테크', title: '챗GPT 실무 활용 바이블', level: '기초/심화', status: '게시중' },
              { cat: 'AI 테크', title: '프롬프트 엔지니어링 마스터', level: '심화', status: '게시중' },
              { cat: '경제/금융', title: '보험 마케팅을 위한 AI 팁', level: '실무', status: '게시중' },
              { cat: '경제/금융', title: '시니어 맞춤형 디지털 자산 관리', level: '기초', status: '점검중' },
              { cat: 'AI 테크', title: '나노바나나 이미지 생성 기법', level: '심화', status: '게시중' },
            ].map((lec, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${lec.cat === 'AI 테크' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                    {lec.cat}
                  </span>
                </td>
                <td className="px-8 py-5 font-bold text-slate-900" style={{ fontSize: '0.8rem' }}>{lec.title}</td>
                <td className="px-8 py-5 font-medium text-slate-500" style={{ fontSize: '0.8rem' }}>{lec.level}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${lec.status === '게시중' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                    <span className="text-[10px] font-bold text-slate-600">{lec.status}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-sky-600"><Edit2 size={14} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const InquiriesContent = () => (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">문의 확인</h1>
          <p className="text-slate-500 mt-2 font-medium" style={{ fontSize: '0.8rem' }}>수강생 및 기관에서 보낸 메시지를 확인합니다.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
             CSV 다운로드
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {[
          { name: '사하구청 경제과', email: 'saha_economy@saha.go.kr', msg: '올해 5월부터 시작하는 시니어 디지털 금융 정규 강좌에 김경수 강사님을 초빙하고 싶습니다. 커리큘럼 조정이 가능한지 문의드립니다.', date: '2024.03.15 10:24', isRead: false },
          { name: '이동혁 (보험설계사)', email: 'dh_lee@insure.com', msg: 'GA 실전 AI 마케팅 팁 강의 너무 잘 들었습니다. 혹시 팀 단위로 프라이빗 워크숍도 진행하시나요?', date: '2024.03.14 15:40', isRead: true },
          { name: '부산시민대학 교육팀', email: 'busan_edu@humanbook.org', msg: '휴먼북 강사 활동 관련하여 4월 일정 확인 부탁드립니다.', date: '2024.03.12 09:12', isRead: true }
        ].map((inq, i) => (
          <div key={i} className={`p-8 rounded-[32px] border ${inq.isRead ? 'bg-white border-slate-100' : 'bg-white border-sky-300 ring-2 ring-sky-50 shadow-lg'} transition-all flex flex-col md:flex-row gap-8`}>
            <div className="shrink-0 flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${inq.isRead ? 'bg-slate-100 text-slate-400' : 'bg-sky-600 text-white'}`}>
                {inq.name[0]}
              </div>
              {!inq.isRead && <span className="mt-3 text-sky-600 text-[8px] font-black uppercase tracking-widest animate-pulse">New Message</span>}
            </div>
            <div className="flex-1">
               <div className="flex items-center justify-between mb-4">
                 <div>
                   <h4 className="font-black text-slate-900 text-lg leading-tight">{inq.name}</h4>
                   <p className="text-slate-400 font-bold" style={{ fontSize: '9px' }}>{inq.email}</p>
                 </div>
                 <time className="text-slate-400 font-medium" style={{ fontSize: '9px' }}>{inq.date}</time>
               </div>
               <p className="text-slate-600 leading-relaxed font-medium" style={{ fontSize: '0.8rem' }}>{inq.msg}</p>
               <div className="mt-8 flex gap-3">
                  <button className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-700 transition-all">답장하기</button>
                  <button className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">보관함으로 이동</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsContent = () => (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">사이트 설정</h1>
          <p className="text-slate-500 mt-2 font-medium" style={{ fontSize: '0.8rem' }}>포트폴리오 기본 정보 및 연동 서비스를 관리합니다.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
            <h3 className="font-black text-lg tracking-tight mb-8">기본 프로필 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">성함</label>
                <input type="text" defaultValue="김경수" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[0.8rem] focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">영문명</label>
                <input type="text" defaultValue="Kim Kyeongsu" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[0.8rem] focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">연락처</label>
                <input type="text" defaultValue="010-8739-7090" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[0.8rem] focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">이메일</label>
                <input type="email" defaultValue="kksu2108@gmail.com" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[0.8rem] focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">소개 한마디</label>
              <textarea rows={3} defaultValue="테두리 없는 삶으로 항상 새로운 일을 모색합니다." className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[0.8rem] focus:ring-2 focus:ring-sky-500 outline-none"></textarea>
            </div>
            <div className="pt-4">
              <button className="px-10 py-4 bg-sky-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all">설정 저장</button>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
             <h3 className="font-black text-lg tracking-tight mb-8">보안 설정</h3>
             <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm"><Lock className="text-slate-400" size={18} /></div>
                  <div>
                    <div className="font-bold text-slate-900" style={{ fontSize: '0.8rem' }}>관리자 비밀번호 변경</div>
                    <p className="text-slate-400 font-medium" style={{ fontSize: '9px' }}>현재 비밀번호: **** (2108)</p>
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">비밀번호 수정</button>
             </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl group-hover:bg-sky-500/30 transition-all"></div>
            <h3 className="font-black text-lg tracking-tight mb-6 flex items-center gap-3">
              <Globe size={20} className="text-sky-400" /> 도메인 정보
            </h3>
            <div className="space-y-6 relative z-10">
               <div>
                 <div className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-300/60 mb-1">Status</div>
                 <div className="flex items-center gap-2 text-[12px] font-black">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                   LIVE ON PRODUCTION
                 </div>
               </div>
               <div>
                 <div className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-300/60 mb-1">URL</div>
                 <div className="text-[12px] font-black text-white/90">kimkyeongsu.portfolio.com</div>
               </div>
               <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">고급 DNS 설정</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="min-h-screen bg-slate-50 flex font-pretendard">
      <AdminSidebar />
      <main className="flex-1 p-16 overflow-y-auto">
        {currentAdminTab === 'dashboard' && <DashboardContent />}
        {currentAdminTab === 'lectures' && <LectureManagementContent />}
        {currentAdminTab === 'inquiries' && <InquiriesContent />}
        {currentAdminTab === 'settings' && <SettingsContent />}
      </main>
    </div>
  );

  // Router logic
  if (view === 'admin') {
    return isAdminLoggedIn ? <AdminDashboard /> : <AdminLoginScreen />;
  }

  // --- Public Site UI (Existing logic reused with 80%/120% rule) ---
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

      {/* Public Sub-sections (Briefly Re-implemented or Re-used) */}
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

      {/* Experience, Lectures, Vision, Contact - Reused with simplified markup for brevity */}
      <section id="experience" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-20 tracking-tight">30년 경력의 전문가적 통찰</h2>
          <div className="max-w-3xl mx-auto text-left space-y-12">
            {[
              { title: 'DB손해보험 30년', detail: '부산본부 본부장 및 교육팀장 역임. 현장 중심의 마케팅 및 교육 전략 수립 전문.' },
              { title: 'AI 및 경제 교육 전문가', detail: '부산지역 경제교육센터 강사, 시니어 디지털 리터러시 및 프롬프트 엔지니어링 강의 수행.' }
            ].map((exp, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
                <h4 className="font-black text-xl mb-4">{exp.title}</h4>
                <p className="text-slate-500 font-medium" style={{ fontSize: '85%' }}>{exp.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lectures" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="p-12 rounded-[50px] bg-slate-900 text-white shadow-2xl">
              <h3 className="text-2xl font-black mb-10">AI 테크놀로지</h3>
              <ul className="space-y-4">
                {["챗GPT 실무 활용", "프롬프트 엔지니어링", "NotebookLM 지식 관리", "AI 이미지 생성"].map((t, i) => (
                  <li key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 font-bold" style={{ fontSize: '85%' }}>{t}</li>
                ))}
              </ul>
           </div>
           <div className="p-12 rounded-[50px] bg-sky-50 border border-sky-100">
              <h3 className="text-2xl font-black text-slate-900 mb-10">경제 & 라이프</h3>
              <ul className="space-y-4">
                {["보험 AI 마케팅", "시니어 디지털 자산", "금융 사고 예방", "은퇴 설계 지표"].map((t, i) => (
                  <li key={i} className="p-4 bg-white rounded-2xl border border-sky-200/50 font-bold text-slate-800" style={{ fontSize: '85%' }}>{t}</li>
                ))}
              </ul>
           </div>
        </div>
      </section>

      <section id="contact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50 rounded-[60px] p-20 flex flex-col md:flex-row gap-20 border border-slate-100">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-black mb-10 tracking-tight">협업 문의</h2>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600"><Phone size={24} /></div>
                  <div className="font-black text-xl">010-8739-7090</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600"><Mail size={24} /></div>
                  <div className="font-black text-xl">kksu2108@gmail.com</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-white p-10 rounded-[40px] shadow-2xl">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="성함" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" style={{ fontSize: '85%' }} />
                <textarea rows={4} placeholder="문의 내용" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" style={{ fontSize: '85%' }}></textarea>
                <button className="w-full py-5 bg-sky-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-sky-100">전송하기</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Admin Trigger */}
      <footer className="py-20 bg-white border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sky-600 font-black text-[12px] tracking-[0.4em] uppercase mb-10">Kim Kyeongsu | AI Education Master</div>
          <button 
            onClick={() => setView('admin')} 
            className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-sky-600 border border-slate-100 px-8 py-3 rounded-full transition-all hover:bg-sky-50"
          >
            Admin Panel
          </button>
          <p className="text-slate-400 text-[10px] font-bold mt-10 uppercase tracking-widest">© 2024 Kim Kyeongsu. All Rights Reserved.</p>
        </div>
      </footer>

      {/* AI Assistant UI (Omitted but assumed present in original state) */}
      <div className="fixed bottom-10 right-10 z-[60]">
        {!isChatOpen ? (
          <button onClick={() => setIsChatOpen(true)} className="w-20 h-20 bg-slate-900 text-white rounded-[30px] flex items-center justify-center shadow-2xl hover:scale-110 transition-all"><MessageSquare size={28} /></button>
        ) : (
          <div className="w-96 bg-white rounded-[45px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
             <div className="p-7 bg-slate-900 text-white flex items-center justify-between font-black uppercase tracking-widest text-[10px]">
                <div className="flex items-center gap-3"><Cpu size={16} /> AI Assistant</div>
                <button onClick={() => setIsChatOpen(false)}><X size={20} /></button>
             </div>
             <div className="h-96 overflow-y-auto p-8 space-y-4 bg-slate-50/50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-[24px] font-bold ${m.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200'}`} style={{ fontSize: '80%' }}>{m.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>
             <div className="p-6 border-t border-slate-100 flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-slate-100 rounded-xl px-4 font-bold text-[80%] outline-none" placeholder="궁금한 점을 물어보세요" />
                <button onClick={handleSendMessage} className="p-4 bg-sky-600 text-white rounded-xl"><Send size={18} /></button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
