import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Types ---
type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh';
type ViewState = 'landing' | 'dashboard' | 'editor' | 'plans';

interface Experience {
  id: string; company: string; role: string; startDate: string; endDate: string; current: boolean; description: string;
}
interface Education {
  id: string; institution: string; degree: string; startDate: string; endDate: string;
}
interface Resume {
  id: string; title: string; lastModified: number;
  personalInfo: { fullName: string; email: string; phone: string; location: string; linkedin: string; website: string; jobTitle: string; };
  summary: string; experience: Experience[]; education: Education[]; skills: string;
}
interface UserState { isPremium: boolean; credits: number; }

const LANG_NAMES: Record<Language, string> = {
  pt: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', ja: '日本語', zh: '中文'
};

// --- Translations ---
const translations: Record<Language, any> = {
  pt: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "Arquitetura de Carreira Potencializada por IA", subHero: "Não perca tempo com layouts. Nossa IA constrói currículos de alta performance que garantem entrevistas em empresas Tier-1.", cta: "Começar Agora", login: "Entrar", dashboardTitle: "Central de Comando", newResume: "Novo Currículo", lastModified: "Última modificação", proTag: "USUÁRIO PRO", freeTag: "CONTA GRÁTIS", upgrade: "Fazer Upgrade",
    editor: { back: "Voltar", export: "Exportar PDF", untitled: "Currículo Sem Título", personal: "1. Marca Pessoal", summary: "2. Sumário Profissional", experience: "3. Trajetória", education: "4. Formação", skills: "5. Competências", match: "Aderência à Vaga", addRole: "Adicionar Cargo", addEdu: "Adicionar Educação", aiMagic: "Magia R²", optimize: "Otimizar com IA", matchPlaceholder: "Cole aqui a descrição da vaga...", analyze: "Analisar Aderência", analyzing: "Analisando...", lock: "Função Exclusiva PRO",
      labels: { name: "Nome Completo", title: "Cargo Alvo", email: "E-mail", phone: "Telefone", location: "Localização", company: "Empresa", role: "Cargo", start: "Início", end: "Fim", current: "Atual", skills: "Habilidades" },
      preview: { profile: "Perfil", exp: "Experiência", edu: "Formação", skills: "Assets Centrais", present: "ATUAL" }
    },
    matchRes: { score: "Nota de Aderência", feedback: "Diretrizes de Melhoria" }, 
    plans: {
      title: "Escolha o plano ideal", sub: "Arquitetura de carreira sob medida para seus objetivos.", 
      oneTime: "Pagamento Único", oneTimeSub: "Perfeito para necessidades rápidas", oneTimePrice: "R$ 4,99", oneTimeFeatures: ["1 Currículo Otimizado", "Templates Modernos", "Exportação PDF", "Suporte Multi-idioma"],
      pro: "Assinatura PRO", proSub: "Melhor valor para candidatos ativos", proPrice: "R$ 19,90", proFreq: "/mês", proFeatures: ["Currículos Ilimitados", "Otimização p/ Vagas", "Análise de Aderência", "Histórico de Versões", "Suporte Prioritário"],
      choose: "Escolher Plano", current: "Seu Plano Atual"
    },
    footer: "Powered by R² Solutions Group"
  },
  en: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "AI-Powered Career Architecture", subHero: "Stop wasting time on layouts. Our AI builds high-performance resumes that guarantee interviews at Tier-1 companies.", cta: "Start Now", login: "Login", dashboardTitle: "Command Center", newResume: "New Resume", lastModified: "Last modified", proTag: "PRO USER", freeTag: "FREE ACCOUNT", upgrade: "Upgrade Now",
    editor: { back: "Back", export: "Export PDF", untitled: "Untitled Resume", personal: "1. Personal Branding", summary: "2. Professional Summary", experience: "3. Trajectory", education: "4. Formation", skills: "5. Competencies", match: "Job Adherence", addRole: "Add Role", addEdu: "Add Education", aiMagic: "R² Magic", optimize: "AI Optimize", matchPlaceholder: "Paste the job description here...", analyze: "Analyze Adherence", analyzing: "Analyzing...", lock: "Exclusive PRO Feature",
      labels: { name: "Full Name", title: "Target Title", email: "Email", phone: "Phone", location: "Location", company: "Company", role: "Role", start: "Start", end: "End", current: "Current", skills: "Skills" },
      preview: { profile: "Profile", exp: "Experience", edu: "Education", skills: "Core Assets", present: "PRESENT" }
    },
    matchRes: { score: "Adherence Score", feedback: "Improvement Guidelines" },
    plans: {
      title: "Choose the best plan", sub: "Tailored career architecture for your goals.", 
      oneTime: "One-Time Payment", oneTimeSub: "Perfect for quick needs", oneTimePrice: "$ 3.99", oneTimeFeatures: ["1 Optimized Resume", "Modern Templates", "PDF Export", "Multi-language Support"],
      pro: "PRO Subscription", proSub: "Best value for job seekers", proPrice: "$ 9.99", proFreq: "/mo", proFeatures: ["Unlimited Resumes", "Job-Specific Optimization", "Adherence Analysis", "Version History", "Priority Support"],
      choose: "Choose Plan", current: "Current Plan"
    },
    footer: "Powered by R² Solutions Group"
  },
  es: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "Arquitectura de Carrera con IA", subHero: "No pierdas tiempo con diseños. Nuestra IA construye currículos de alto rendimiento para empresas Tier-1.", cta: "Empezar Ahora", login: "Entrar", dashboardTitle: "Centro de Mando", newResume: "Nuevo Currículum", lastModified: "Última modificación", proTag: "USUARIO PRO", freeTag: "CUENTA GRATIS", upgrade: "Actualizar",
    editor: { back: "Volver", export: "Exportar PDF", untitled: "Currículum sin Título", personal: "1. Marca Pessoal", summary: "2. Resumen Profesional", experience: "3. Trayectoria", education: "4. Formación", skills: "5. Competencias", match: "Ajuste de Vacante", addRole: "Añadir Puesto", addEdu: "Añadir Educación", aiMagic: "Magia R²", optimize: "Optimizar IA", matchPlaceholder: "Pega aquí la descripción de la vacante...", analyze: "Analizar Ajuste", analyzing: "Analizando...", lock: "Función Exclusiva PRO",
      labels: { name: "Nombre Completo", title: "Cargo Objetivo", email: "Correo", phone: "Teléfono", location: "Ubicación", company: "Empresa", role: "Cargo", start: "Inicio", end: "Fin", current: "Actual", skills: "Habilidades" },
      preview: { profile: "Perfil", exp: "Experiencia", edu: "Formación", skills: "Assets Centrales", present: "ACTUAL" }
    },
    matchRes: { score: "Puntuación de Ajuste", feedback: "Directrices de Mejora" },
    plans: {
      title: "Elige el plan ideal", sub: "Arquitectura de carrera a medida.", 
      oneTime: "Pago Único", oneTimeSub: "Perfecto para necesidades rápidas", oneTimePrice: "$ 3.99", oneTimeFeatures: ["1 Currículum Optimizado", "Plantillas Modernas", "Exportación PDF", "Soporte Multi-idioma"],
      pro: "Suscripción PRO", proSub: "Mejor valor para candidatos", proPrice: "$ 9.99", proFreq: "/mes", proFeatures: ["Currículos Ilimitados", "Optimización por Vacante", "Análisis de Ajuste", "Historial de Versiones", "Soporte Prioritario"],
      choose: "Elegir Plan", current: "Tu Plan Actual"
    },
    footer: "Powered by R² Solutions Group"
  },
  fr: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "Architecture de Carrière par IA", subHero: "Ne perdez plus de temps sur la mise en page. Notre IA crée des CV haute performance pour les entreprises Tier-1.", cta: "Commencer", login: "Connexion", dashboardTitle: "Centre de Commandement", newResume: "Nouveau CV", lastModified: "Dernière modification", proTag: "UTILISATEUR PRO", freeTag: "COMPTE GRATUIT", upgrade: "Mise à niveau",
    editor: { back: "Retour", export: "Exporter PDF", untitled: "CV sans titre", personal: "1. Personal Branding", summary: "2. Résumé Professionnel", experience: "3. Trajectoire", education: "4. Formation", skills: "5. Compétences", match: "Adéquation au Poste", addRole: "Ajouter Poste", addEdu: "Ajouter Éducation", aiMagic: "Magie R²", optimize: "Optimiser IA", matchPlaceholder: "Collez la description du poste ici...", analyze: "Analyser Adéquation", analyzing: "Analyse...", lock: "Fonction PRO Exclusive",
      labels: { name: "Nom Complet", title: "Poste Cible", email: "E-mail", phone: "Téléphone", location: "Localisation", company: "Entreprise", role: "Rôle", start: "Début", end: "Fin", current: "Actuel", skills: "Compétences" },
      preview: { profile: "Profil", exp: "Expérience", edu: "Formation", skills: "Atouts Clés", present: "ACTUEL" }
    },
    matchRes: { score: "Score d'Adéquation", feedback: "Directives d'Amélioration" },
    plans: {
      title: "Choisissez votre plan", sub: "Architecture de carrière sur mesure.", 
      oneTime: "Paiement Unique", oneTimeSub: "Parfait pour un besoin rapide", oneTimePrice: "€ 3.49", oneTimeFeatures: ["1 CV Optimisé", "Modèles Modernes", "Exportation PDF", "Multi-langues"],
      pro: "Abonnement PRO", proSub: "Meilleure valeur pour candidats", proPrice: "€ 8.99", proFreq: "/mois", proFeatures: ["CV Illimités", "Optimisation par Poste", "Analyse d'Adéquation", "Historique", "Support Prioritaire"],
      choose: "Choisir Plan", current: "Plan Actuel"
    },
    footer: "Powered by R² Solutions Group"
  },
  de: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "KI-Karriere-Architektur", subHero: "Sparen Sie Zeit beim Layout. Unsere KI erstellt Hochleistungs-Lebensläufe für Tier-1-Unternehmen.", cta: "Jetzt Starten", login: "Login", dashboardTitle: "Kommandozentrale", newResume: "Neuer Lebenslauf", lastModified: "Zuletzt geändert", proTag: "PRO NUTZER", freeTag: "GRATIS KONTO", upgrade: "Upgrade Jetzt",
    editor: { back: "Zurück", export: "PDF Export", untitled: "Unbenannt", personal: "1. Personal Branding", summary: "2. Zusammenfassung", experience: "3. Werdegang", education: "4. Ausbildung", skills: "5. Kompetenzen", match: "Stellen-Passgenauigkeit", addRole: "Rolle hinzufügen", addEdu: "Ausbildung hinzufügen", aiMagic: "R² Magie", optimize: "KI Optimieren", matchPlaceholder: "Stellenbeschreibung hier einfügen...", analyze: "Passgenauigkeit prüfen", analyzing: "Analyse...", lock: "Exklusive PRO Funktion",
      labels: { name: "Vollständiger Name", title: "Zielposition", email: "E-Mail", phone: "Telefon", location: "Ort", company: "Firma", role: "Rolle", start: "Start", end: "Ende", current: "Aktuell", skills: "Fähigkeiten" },
      preview: { profile: "Profil", exp: "Erfahrung", edu: "Ausbildung", skills: "Kernkompetenzen", present: "AKTUELL" }
    },
    matchRes: { score: "Matching-Score", feedback: "Optimierungsvorschläge" },
    plans: {
      title: "Wählen Sie Ihren Plan", sub: "Maßgeschneiderte Karriere-Architektur.", 
      oneTime: "Einmalzahlung", oneTimeSub: "Perfekt für den schnellen Start", oneTimePrice: "€ 3.49", oneTimeFeatures: ["1 Optimierter Lebenslauf", "Moderne Vorlagen", "PDF Export", "Multi-Sprachen"],
      pro: "PRO Abonnement", proSub: "Bester Wert für Bewerber", proPrice: "€ 8.99", proFreq: "/monat", proFeatures: ["Unbegrenzte Lebensläufe", "Job-Optimierung", "Matching-Analyse", "Versionsverlauf", "Prio Support"],
      choose: "Plan wählen", current: "Aktueller Plan"
    },
    footer: "Powered by R² Solutions Group"
  },
  it: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "Architettura di Carriera con IA", subHero: "Smetti di sprecare tempo sui layout. La nostra IA costruisce CV ad alte prestazioni per aziende Tier-1.", cta: "Inizia Ora", login: "Accedi", dashboardTitle: "Centro Comando", newResume: "Nuovo CV", lastModified: "Ultima modifica", proTag: "UTENTE PRO", freeTag: "ACCOUNT GRATIS", upgrade: "Passa a Pro",
    editor: { back: "Indietro", export: "Esporta PDF", untitled: "CV senza titolo", personal: "1. Personal Branding", summary: "2. Riepilogo Professionale", experience: "3. Traiettoria", education: "4. Formazione", skills: "5. Competenze", match: "Aderenza Posizione", addRole: "Aggiungi Ruolo", addEdu: "Aggiungi Istruzione", aiMagic: "Magia R²", optimize: "Ottimizza IA", matchPlaceholder: "Incolla la descrizione del lavoro...", analyze: "Analizza Aderenza", analyzing: "Analisi...", lock: "Funzione PRO Esclusiva",
      labels: { name: "Nome Completo", title: "Ruolo Obiettivo", email: "Email", phone: "Telefono", location: "Località", company: "Azienda", role: "Ruolo", start: "Inizio", end: "Fine", current: "Attuale", skills: "Competenze" },
      preview: { profile: "Profilo", exp: "Esperienza", edu: "Istruzione", skills: "Asset Chiave", present: "ATTUALE" }
    },
    matchRes: { score: "Punteggio Aderenza", feedback: "Linee Guida Miglioramento" },
    plans: {
      title: "Scegli il piano ideale", sub: "Architettura di carriera su misura.", 
      oneTime: "Pagamento Singolo", oneTimeSub: "Perfetto per necessità rapide", oneTimePrice: "€ 3.49", oneTimeFeatures: ["1 CV Ottimizzato", "Template Moderni", "Esporta PDF", "Multi-lingua"],
      pro: "Abbonamento PRO", proSub: "Miglior valore per candidati", proPrice: "€ 8.99", proFreq: "/mese", proFeatures: ["CV Illimitati", "Ottimizzazione Posto", "Analisi Aderenza", "Cronologia Versioni", "Supporto Prio"],
      choose: "Scegli Piano", current: "Piano Attuale"
    },
    footer: "Powered by R² Solutions Group"
  },
  ja: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "AIキャリア・アーキテクチャ", subHero: "レイアウトに時間を費やすのはやめましょう。弊社のAIがTier-1企業向けの高性能な履歴書を作成します。", cta: "今すぐ開始", login: "ログイン", dashboardTitle: "コマンドセンター", newResume: "新規作成", lastModified: "最終更新", proTag: "プロユーザー", freeTag: "無料アカウント", upgrade: "アップグレード",
    editor: { back: "戻る", export: "PDF出力", untitled: "無題の履歴書", personal: "1. パーソナルブランディング", summary: "2. プロフィール", experience: "3. 経歴", education: "4. 学歴", skills: "5. スキル", match: "求人適合度", addRole: "職歴追加", addEdu: "学歴追加", aiMagic: "R² マジック", optimize: "AI最適化", matchPlaceholder: "求人内容をここに貼り付けてください...", analyze: "適合度を分析", analyzing: "分析中...", lock: "プロ専用機能",
      labels: { name: "氏名", title: "希望職種", email: "メール", phone: "電話番号", location: "住所", company: "会社名", role: "役職", start: "開始", end: "終了", current: "現在", skills: "スキル" },
      preview: { profile: "プロフィール", exp: "職務経歴", edu: "学歴", skills: "主要スキル", present: "現在" }
    },
    matchRes: { score: "適合スコア", feedback: "改善ガイドライン" },
    plans: {
      title: "最適なプランを選択", sub: "あなたの目標に合わせたキャリア設計。", 
      oneTime: "一回払い", oneTimeSub: "迅速な対応に最適", oneTimePrice: "$ 3.99", oneTimeFeatures: ["最適化された履歴書1通", "モダンなテンプレート", "PDF出力", "多言語サポート"],
      pro: "プロ版サブスク", proSub: "求職者に最適な価値", proPrice: "$ 9.99", proFreq: "/月", proFeatures: ["履歴書無制限", "求人別最適化", "適合度分析", "バージョン履歴", "優先サポート"],
      choose: "プランを選択", current: "現在のプラン"
    },
    footer: "Powered by R² Solutions Group"
  },
  zh: {
    brand: "R² SOLUTIONS GROUP", consulting: "TECH & CONSULTING", hero: "AI驱动职业架构", subHero: "无需浪费时间在排版。我们的AI为顶级公司打造高性能简历。", cta: "立即开始", login: "登录", dashboardTitle: "指挥中心", newResume: "新建简历", lastModified: "最后修改", proTag: "专业版用户", freeTag: "免费账户", upgrade: "立即升级",
    editor: { back: "返回", export: "导出 PDF", untitled: "未命名简历", personal: "1. 个人品牌", summary: "2. 专业摘要", experience: "3. 职业轨迹", education: "4. 教育背景", skills: "5. 核心技能", match: "岗位匹配度", addRole: "添加职位", addEdu: "添加教育", aiMagic: "R² 魔法", optimize: "AI 优化", matchPlaceholder: "在此处粘贴职位描述...", analyze: "分析匹配度", analyzing: "分析中...", lock: "专业版专属功能",
      labels: { name: "全名", title: "目标职位", email: "邮箱", phone: "电话", location: "地点", company: "公司", role: "职位", start: "开始", end: "结束", current: "至今", skills: "技能" },
      preview: { profile: "个人档案", exp: "工作经历", edu: "教育背景", skills: "核心资产", present: "至今" }
    },
    matchRes: { score: "匹配得分", feedback: "改进指南" },
    plans: {
      title: "选择理想方案", sub: "量身定制的职业架构。", 
      oneTime: "单次付费", oneTimeSub: "适合快速生成需求", oneTimePrice: "$ 3.99", oneTimeFeatures: ["1份优化简历", "现代模板", "PDF导出", "多语言支持"],
      pro: "专业版订阅", proSub: "求职者最佳选择", proPrice: "$ 9.99", proFreq: "/月", proFeatures: ["无限量简历", "职位针对性优化", "匹配度分析", "版本历史", "优先支持"],
      choose: "选择方案", current: "当前方案"
    },
    footer: "Powered by R² Solutions Group"
  }
};

// --- Icons ---
const Icons = {
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Wand: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M9 6v4"/><path d="M2 10h4"/><path d="M2 6h4"/></svg>,
  Lock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Globe: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ArrowLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  CheckCircle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
};

// --- Components ---
const Navbar = ({ onBack, onLogin, user, lang, setLang, setView, showBack = false }: any) => {
  const t = translations[lang];
  return (
    <nav className="border-b border-white/5 py-4 px-8 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50 bg-slate-950/80">
      <div className="flex items-center gap-6">
        {showBack && (
          <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-tighter transition-all">
            <Icons.ArrowLeft /> {t.editor.back}
          </button>
        )}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded flex items-center justify-center font-black italic shadow-indigo-500/20 shadow-lg">R²</div>
          <div>
            <div className="font-black text-white text-sm tracking-tight">{t.brand}</div>
            <div className="text-[9px] font-bold text-indigo-400 tracking-[0.2em] -mt-1">{t.consulting}</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 group relative">
          <Icons.Globe />
          <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-white/60 outline-none cursor-pointer hover:text-white">
            {Object.entries(LANG_NAMES).map(([code, name]) => (
              <option key={code} value={code} className="bg-slate-900">{code.toUpperCase()}</option>
            ))}
          </select>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
             {user.isPremium ? (
               <span className="text-[10px] font-black bg-indigo-500 text-white px-3 py-1 rounded-full">{t.proTag}</span>
             ) : (
               <button onClick={() => setView('plans')} className="text-[10px] font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full hover:scale-105 transition-all">{t.upgrade}</button>
             )}
          </div>
        ) : (
          <button onClick={onLogin} className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white">{t.login}</button>
        )}
      </div>
    </nav>
  );
};

const PlansPage = ({ lang, setLang, user, setUser, setView }: any) => {
  const t = translations[lang].plans;
  const commonT = translations[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar lang={lang} setLang={setLang} user={user} setView={setView} showBack onBack={() => setView('dashboard')} />
      <div className="container mx-auto px-8 py-20 flex-1">
        <div className="text-center mb-20">
           <h2 className="text-5xl font-black mb-6 tracking-tighter">{t.title}</h2>
           <p className="text-slate-400 text-lg max-w-xl mx-auto font-light leading-relaxed">{t.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
           {/* One-Time Plan */}
           <div className="p-10 rounded-[50px] bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col">
              <div className="mb-10">
                 <h3 className="text-2xl font-black mb-2">{t.oneTime}</h3>
                 <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{t.oneTimeSub}</p>
              </div>
              <div className="mb-10">
                 <span className="text-5xl font-black">{t.oneTimePrice}</span>
                 <span className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-2">/ RESUME</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                 {t.oneTimeFeatures.map((f: string, i: number) => (
                   <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                      <Icons.CheckCircle /> {f}
                   </li>
                 ))}
              </ul>
              <button onClick={() => alert("Simulation: R² Single Generation Purchased.")} className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-950 rounded-2xl font-black transition-all">
                 {t.choose}
              </button>
           </div>

           {/* PRO Plan */}
           <div className="p-10 rounded-[50px] bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 border-2 border-indigo-500 shadow-[0_0_50px_rgba(79,70,229,0.3)] relative flex flex-col scale-105">
              <div className="absolute top-6 right-10 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">POPULAR</div>
              <div className="mb-10">
                 <h3 className="text-2xl font-black mb-2">{t.pro}</h3>
                 <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest">{t.proSub}</p>
              </div>
              <div className="mb-10">
                 <span className="text-5xl font-black">{t.proPrice}</span>
                 <span className="text-slate-400 text-sm font-bold uppercase tracking-widest ml-1">{t.proFreq}</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                 {t.proFeatures.map((f: string, i: number) => (
                   <li key={i} className="flex items-center gap-3 text-sm text-white font-semibold">
                      <Icons.CheckCircle /> {f}
                   </li>
                 ))}
              </ul>
              <button 
                onClick={() => { setUser({...user, isPremium: true}); setView('dashboard'); }} 
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/30 active:scale-95 transition-all"
              >
                 {user.isPremium ? t.current : t.choose}
              </button>
           </div>
        </div>
      </div>
      <footer className="py-10 text-center opacity-40 text-[11px] font-bold uppercase tracking-[0.2em] border-t border-white/5">
        {commonT.footer}
      </footer>
    </div>
  );
};

// --- AI Service ---
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analyzeAdherence = async (resume: Resume, jobDesc: string, lang: Language) => {
  const model = genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze resume vs job description. Return JSON: { "score": number, "feedback": string[] }. Write in ${LANG_NAMES[lang]}. Resume: ${JSON.stringify(resume)}. Job: ${jobDesc}`,
    config: { responseMimeType: "application/json" }
  });
  const res = await model;
  return JSON.parse(res.text || '{"score":0, "feedback":[]}');
};

const handleMagicAI = async (resume: Resume, lang: Language) => {
  const model = genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an R² Solutions Group Senior Consultant, write a high-impact summary (3 sentences) in ${LANG_NAMES[lang]} for: ${JSON.stringify(resume)}`,
  });
  const res = await model;
  return res.text || "";
};

// --- Views ---
const LandingPage = ({ onStart, lang, setLang, setView }: any) => {
  const t = translations[lang];
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col">
      <Navbar onLogin={onStart} lang={lang} setLang={setLang} setView={setView} />
      <div className="container mx-auto px-8 py-32 text-center relative flex-1">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-indigo-600/20 blur-[150px] -z-10 rounded-full"></div>
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
          {t.hero.split(' ').map((w: string, i: number) => <span key={i} className={i > 2 ? "text-indigo-400" : ""}>{w} </span>)}
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          {t.subHero}
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <button onClick={onStart} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-indigo-600/30">
            {t.cta}
          </button>
          <a href="https://orafarosa.github.io/R2-Solutions-Group/" target="_blank" className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-lg transition-all">
            R² Solutions Group
          </a>
        </div>
      </div>
      <footer className="py-10 text-center opacity-40 text-[11px] font-bold uppercase tracking-[0.2em] border-t border-white/5">
        {t.footer}
      </footer>
    </div>
  );
};

const Dashboard = ({ resumes, onCreate, onEdit, lang, setLang, user, setView }: any) => {
  const t = translations[lang];
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar lang={lang} setLang={setLang} user={user} setView={setView} />
      <div className="max-w-6xl mx-auto px-8 py-16 flex-1 w-full">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">{t.dashboardTitle}</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{user.isPremium ? t.proTag : t.freeTag}</p>
          </div>
          <button onClick={onCreate} className="px-8 py-3 bg-slate-950 text-white rounded-xl font-black text-sm shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">
            {t.newResume}
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {resumes.map((r: any) => (
            <div key={r.id} onClick={() => onEdit(r.id)} className="p-8 rounded-[40px] bg-white border border-slate-200 hover:border-indigo-500 cursor-pointer transition-all group shadow-sm">
               <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                 <Icons.Plus />
               </div>
               <h3 className="font-black text-xl text-slate-900 mb-1">{r.title || t.editor.untitled}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.lastModified}: {new Date(r.lastModified).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="py-8 text-center opacity-40 text-[10px] font-black uppercase tracking-widest border-t border-slate-200 bg-white">
        {t.footer}
      </footer>
    </div>
  );
};

const Editor = ({ resume, onUpdate, onBack, lang, setLang, user, setView }: any) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'content' | 'match'>('content');
  const [jobDesc, setJobDesc] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const checkPremium = (action: () => void) => {
    if (user.isPremium) action();
    else setView('plans');
  };

  const handleAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeAdherence(resume, jobDesc, lang);
      setMatchResult(res);
    } catch(e) { alert("Error R² Analysis Engine"); }
    finally { setAnalyzing(false); }
  };

  const handleAiMagic = async () => {
    checkPremium(async () => {
      const summary = await handleMagicAI(resume, lang);
      onUpdate({...resume, summary});
    });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      <Navbar lang={lang} setLang={setLang} user={user} onBack={onBack} setView={setView} showBack />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 overflow-y-auto bg-white p-12 no-print border-r border-slate-200">
           <div className="flex bg-slate-100 p-1 rounded-2xl w-fit mb-12 shadow-inner">
              <button onClick={() => setActiveTab('content')} className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'content' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}>Content</button>
              <button onClick={() => setActiveTab('match')} className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'match' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}>{t.editor.match}</button>
           </div>

           {activeTab === 'content' ? (
             <div className="space-y-16 pb-20">
                <section>
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">{t.editor.personal}</h3>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{t.editor.labels.name}</label>
                         <input className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={resume.personalInfo.fullName} onChange={e => onUpdate({...resume, personalInfo: {...resume.personalInfo, fullName: e.target.value}})} />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{t.editor.labels.title}</label>
                         <input className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={resume.personalInfo.jobTitle} onChange={e => onUpdate({...resume, personalInfo: {...resume.personalInfo, jobTitle: e.target.value}})} />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{t.editor.labels.email}</label>
                         <input className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={resume.personalInfo.email} onChange={e => onUpdate({...resume, personalInfo: {...resume.personalInfo, email: e.target.value}})} />
                      </div>
                   </div>
                </section>

                <section>
                   <div className="flex justify-between items-center mb-8">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t.editor.summary}</h3>
                     <button onClick={handleAiMagic} className="text-[10px] font-black text-indigo-600 flex items-center gap-1.5 hover:bg-indigo-50 px-3 py-1 rounded-full transition-all">
                        {user.isPremium ? <Icons.Wand /> : <Icons.Lock />} {t.editor.aiMagic}
                     </button>
                   </div>
                   <textarea className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px] leading-relaxed transition-all" value={resume.summary} onChange={e => onUpdate({...resume, summary: e.target.value})} />
                </section>

                <section>
                   <div className="flex justify-between items-center mb-8">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t.editor.experience}</h3>
                     <button onClick={() => onUpdate({...resume, experience: [{id: generateId(), company: '', role: '', startDate: '', endDate: '', current: false, description: ''}, ...resume.experience]})} className="text-[10px] font-black text-indigo-600 flex items-center gap-1.5">
                        <Icons.Plus /> {t.editor.addRole}
                     </button>
                   </div>
                   <div className="space-y-6">
                      {resume.experience.map((exp: any) => (
                        <div key={exp.id} className="p-6 rounded-3xl bg-slate-50 space-y-4 relative group">
                           <input className="w-full bg-white rounded-lg p-3 border-none outline-none font-bold shadow-sm" placeholder={t.editor.labels.role} value={exp.role} onChange={e => onUpdate({...resume, experience: resume.experience.map((x: any) => x.id === exp.id ? {...x, role: e.target.value} : x)})} />
                           <textarea className="w-full bg-white rounded-lg p-3 border-none outline-none text-sm min-h-[100px] shadow-sm" placeholder={t.editor.labels.current} value={exp.description} onChange={e => onUpdate({...resume, experience: resume.experience.map((x: any) => x.id === exp.id ? {...x, description: e.target.value} : x)})} />
                        </div>
                      ))}
                   </div>
                </section>
             </div>
           ) : (
             <div className="space-y-12 pb-20">
                <div className="p-10 rounded-[50px] bg-slate-950 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full"></div>
                   <h3 className="text-3xl font-black mb-4 tracking-tighter">{t.editor.match}</h3>
                   <p className="opacity-50 text-sm font-light mb-8 leading-relaxed">R² Solutions Analysis Engine: Alignment optimization.</p>
                   <textarea className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[250px] mb-8" placeholder={t.editor.matchPlaceholder} value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
                   <button onClick={() => checkPremium(handleAnalysis)} disabled={analyzing} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/30 active:scale-95 transition-all">
                      {analyzing ? t.editor.analyzing : t.editor.analyze}
                   </button>
                </div>

                {matchResult && (
                  <div className="p-10 rounded-[50px] bg-white border border-slate-200 animate-in fade-in slide-in-from-bottom-10 duration-500 shadow-xl">
                     <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.matchRes.score}</span>
                        <span className="text-5xl font-black text-indigo-600">{matchResult.score}%</span>
                     </div>
                     <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-12">
                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{width: `${matchResult.score}%`}}></div>
                     </div>
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{t.matchRes.feedback}</h4>
                     <ul className="space-y-4">
                        {matchResult.feedback.map((f: string, i: number) => (
                          <li key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-[10px] font-bold">{i+1}</div>
                             <p className="text-sm font-medium text-slate-700 leading-relaxed">{f}</p>
                          </li>
                        ))}
                     </ul>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Lado do Preview */}
        <div className="w-1/2 bg-slate-200 p-16 overflow-y-auto flex justify-center items-start">
           <div className="resume-preview bg-white w-[210mm] min-h-[297mm] p-[25mm] shadow-[0_50px_100px_rgba(0,0,0,0.1)] text-slate-900 border-t-[10px] border-slate-950">
              <div className="mb-16">
                 <h1 className="text-5xl font-black tracking-tighter uppercase mb-2 leading-none">{resume.personalInfo.fullName || 'SEU NOME'}</h1>
                 <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.3em]">{resume.personalInfo.jobTitle || 'CARGO OBJETIVO'}</p>
                 <div className="mt-8 flex flex-wrap gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{resume.personalInfo.email}</span>
                    <span>{resume.personalInfo.phone}</span>
                    <span>{resume.personalInfo.location}</span>
                 </div>
              </div>

              <div className="space-y-16">
                 <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 border-b border-slate-100 pb-3 mb-6">{t.editor.preview.profile}</h2>
                    <p className="text-sm leading-loose text-slate-700 font-medium">{resume.summary}</p>
                 </section>

                 <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 border-b border-slate-100 pb-3 mb-8">{t.editor.preview.exp}</h2>
                    <div className="space-y-12">
                       {resume.experience.map((exp: any) => (
                         <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-2">
                               <h3 className="font-black text-xl uppercase tracking-tighter">{exp.role}</h3>
                               <span className="text-[10px] font-black text-slate-400">{exp.startDate} — {exp.current ? t.editor.preview.present : exp.endDate}</span>
                            </div>
                            <p className="text-sm font-black text-indigo-600 mb-4">{exp.company}</p>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 border-b border-slate-100 pb-3 mb-6">{t.editor.preview.skills}</h2>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest leading-loose">{resume.skills}</p>
                 </section>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [lang, setLang] = useState<Language>('pt');
  const [user, setUser] = useState<UserState>({ isPremium: false, credits: 0 });
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('r2-data-v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      setResumes(parsed.resumes || []);
      setUser(parsed.user || { isPremium: false, credits: 0 });
      if (parsed.lang) setLang(parsed.lang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('r2-data-v2', JSON.stringify({ resumes, user, lang }));
  }, [resumes, user, lang]);

  const handleEdit = (id: string) => { setActiveId(id); setView('editor'); };
  
  const createNew = () => {
    const nr = { id: generateId(), title: translations[lang].editor.untitled, lastModified: Date.now(), personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', jobTitle: '' }, summary: '', experience: [], education: [], skills: '' };
    setResumes([nr, ...resumes]);
    handleEdit(nr.id);
  };

  const activeResume = resumes.find(r => r.id === activeId);

  if (view === 'landing') return <LandingPage onStart={() => setView('dashboard')} lang={lang} setLang={setLang} setView={setView} />;
  
  if (view === 'plans') return <PlansPage lang={lang} setLang={setLang} user={user} setUser={setUser} setView={setView} />;

  if (view === 'dashboard') return (
    <Dashboard resumes={resumes} onCreate={createNew} onEdit={handleEdit} lang={lang} setLang={setLang} user={user} setView={setView} />
  );

  if (view === 'editor' && activeResume) return (
    <Editor resume={activeResume} onUpdate={(u: any) => setResumes(resumes.map(r => r.id === u.id ? {...u, lastModified: Date.now()} : r))} onBack={() => setView('dashboard')} lang={lang} setLang={setLang} user={user} setView={setView} />
  );

  return null;
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);