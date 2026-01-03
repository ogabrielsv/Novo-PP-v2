'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Check, X, Shield, Gavel, Gift, Instagram, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ParticipationFormProps {
    raffleId: string;
    whatsappUrl?: string | null;
}

const BRAZIL_STATES = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export function ParticipationForm({ raffleId, whatsappUrl }: ParticipationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<{ number: string | number } | null>(null);
    const [showRules, setShowRules] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            raffleId,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            state: formData.get('state'),
        };

        try {
            const res = await fetch('/api/participants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Erro ao participar'); // Fixed: Changed 'error' to 'result.error'
            }

            setSuccess(result.ticket);
            toast.success('Participação confirmada!');

            // Fire confetti
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#22c55e', '#3b82f6', '#ffffff'] // Green, Blue, White
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#22c55e', '#3b82f6', '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Ocorreu um erro desconhecido');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-black border border-stone-800 rounded-3xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300 relative overflow-hidden ring-1 ring-white/10">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-500/10 blur-[60px] pointer-events-none"></div>

                {/* Top Right Checkmark */}
                <div className="absolute top-4 right-4">
                    <div className="bg-[#4ADE80] rounded-full p-1.5 shadow-lg shadow-green-900/20">
                        <Check className="w-4 h-4 text-black stroke-[3]" />
                    </div>
                </div>

                {/* Main Icon */}
                <div className="relative z-10 pt-2">
                    <div className="w-20 h-20 bg-stone-900/80 rounded-full flex items-center justify-center mx-auto shadow-2xl border border-stone-800 backdrop-blur-sm">
                        <Gift className="w-10 h-10 text-[#4ADE80]" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <div className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Parabéns!</h2>
                </div>

                {/* Info Box */}
                <div className="relative z-10 bg-stone-900/40 border border-stone-800/60 rounded-xl p-5 space-y-4 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-[#4ADE80]">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <p className="text-stone-300 font-medium text-sm">
                                Sua participação foi confirmada com sucesso!
                            </p>
                            <div className="flex items-start justify-center gap-2 text-xs text-stone-500 max-w-[280px] mx-auto text-left bg-black/20 p-2 rounded-lg">
                                <span className="opacity-70 mt-0.5">⚠️</span>
                                <span className="leading-relaxed">
                                    Não esqueça de verificar sua caixa de <strong className="text-stone-400">spam</strong> e a aba de <strong className="text-stone-400">promoções</strong>.
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold tracking-wide uppercase">
                            <span className="text-sm">🏆</span>
                            Elegível para sorteio oficial
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 relative z-10 pt-2">
                    <a
                        href={whatsappUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-900/20 flex items-center justify-center gap-2.5"
                    >
                        <MessageCircle className="w-5 h-5 fill-black stroke-none" />
                        <span className="text-sm">Entrar no Grupo de Novidades</span>
                    </a>

                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-transparent hover:bg-stone-900 border border-stone-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 group"
                    >
                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Siga-nos no Instagram</span>
                    </a>
                </div>

                <p className="text-[10px] text-stone-600 relative z-10 max-w-[250px] mx-auto leading-relaxed">
                    Boa sorte! 🍀 Você receberá um e-mail de confirmação em breve.
                </p>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Digite seu nome completo"
                        className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm"
                    />

                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Digite seu melhor e-mail"
                        className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm"
                    />

                    <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm"
                    />

                    <select
                        name="state"
                        required
                        defaultValue=""
                        className="w-full bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 rounded-lg py-3.5 px-4 focus:outline-none focus:border-stone-600 focus:bg-stone-800 transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Selecione seu estado</option>
                        {BRAZIL_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3 pt-2">
                    <p className="text-xs text-stone-400 font-medium">Aceite obrigatório para participação</p>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input type="checkbox" required className="peer relative appearance-none w-5 h-5 border border-stone-700 rounded bg-transparent checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition-all" />
                            <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <span className="text-xs text-stone-500 group-hover:text-stone-400 transition-colors leading-relaxed select-none">
                            Li e aceito os <button type="button" onClick={() => setShowTerms(true)} className="text-blue-500 hover:text-blue-400 hover:underline">Termos de Uso</button> e a <button type="button" onClick={() => setShowPrivacy(true)} className="text-blue-500 hover:text-blue-400 hover:underline">Política de Privacidade</button> *
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1b64f2] hover:bg-[#1b64f2]/90 text-white py-3.5 rounded-lg font-bold text-base shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processando...
                        </>
                    ) : (
                        'Participar do Sorteio!'
                    )}
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => setShowRules(true)}
                        className="text-xs text-stone-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors px-4 py-2 rounded hover:bg-stone-900/50"
                    >
                        <span className="opacity-70">📜</span> Regras Oficiais do Sorteio
                    </button>
                </div>
            </form>

            {/* Rules Modal */}
            {showRules && (
                <Modal title="Regras do Sorteio" icon={<Gavel className="w-5 h-5 text-blue-500" />} onClose={() => setShowRules(false)}>
                    {/* Existing Rules Content - keeping it simple for now or copying it back */}
                    <div className="space-y-4 text-sm text-stone-300">
                        <div className="space-y-2">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                1. Participação
                            </h4>
                            <p className="leading-relaxed text-stone-400">
                                A participação é voluntária e gratuita. Cada participante pode gerar um número limitado de ingressos conforme regras específicas do sorteio ativo.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                2. Sorteio
                            </h4>
                            <p className="leading-relaxed text-stone-400">
                                Os sorteios são realizados utilizando a Loteria Federal como base, garantindo total transparência e imparcialidade no resultado.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                3. Premiação
                            </h4>
                            <p className="leading-relaxed text-stone-400">
                                O ganhador será contatado via e-mail ou telefone informados no cadastro. O prêmio é pessoal e intransferível.
                            </p>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Privacy Modal */}
            {showPrivacy && (
                <Modal title="Política de Privacidade" icon={<Shield className="w-5 h-5 text-blue-500" />} onClose={() => setShowPrivacy(false)}>
                    <div className="text-sm text-stone-300 whitespace-pre-wrap leading-relaxed">
                        {`Política de Privacidade – Play Prêmios

Data de atualização: 03/01/2026
Versão: 1.0
Base Legal: Lei nº 13.709/2018 – Lei Geral de Proteção de Dados Pessoais (LGPD)

1. QUEM SOMOS

A Play Prêmios é uma plataforma digital destinada à criação, gestão e participação em sorteios online. Atuamos como Controladora dos Dados Pessoais, nos termos da Lei Geral de Proteção de Dados (LGPD), sendo responsáveis pelas decisões referentes ao tratamento das informações pessoais coletadas por meio da plataforma.

2. DADOS PESSOAIS COLETADOS
2.1. Dados fornecidos pelo usuário

Dados cadastrais: nome completo, e-mail e telefone

Dados de localização: estado de residência

Dados de autenticação: senha armazenada de forma criptografada

Dados de participação: histórico de sorteios, números da sorte gerados e interações na plataforma

2.2. Dados coletados automaticamente

Dados de navegação: endereço IP, tipo de navegador, sistema operacional e dispositivo utilizado

Dados de uso: páginas acessadas, tempo de permanência, cliques e interações

Cookies: preferências do usuário, autenticação de sessão e funcionalidades essenciais

Registros de log: data, horário e ações realizadas na plataforma

3. FINALIDADES DO TRATAMENTO DE DADOS
3.1. Base Legal: Execução de Contrato

Os dados pessoais são tratados para:

Criar, administrar e manter a conta do usuário

Permitir a participação em sorteios

Gerar automaticamente números da sorte

Realizar sorteios e apurar ganhadores

Entrar em contato para validação e entrega de prêmios

3.2. Base Legal: Interesse Legítimo

Também utilizamos os dados para:

Garantir a segurança da plataforma e prevenir fraudes

Melhorar funcionalidades, desempenho e experiência do usuário

Realizar análises estatísticas e métricas de uso

Oferecer suporte técnico e atendimento

Comunicar atualizações, novidades, campanhas e sorteios

4. DIREITOS DO TITULAR DOS DADOS

Nos termos da LGPD, o usuário pode exercer, a qualquer momento, os seguintes direitos:

4.1. Direitos de acesso

Confirmação da existência de tratamento de dados

Acesso aos dados pessoais tratados

Informação sobre finalidades, forma e duração do tratamento

4.2. Direitos de controle

Correção de dados incompletos, inexatos ou desatualizados

Solicitação de exclusão de dados desnecessários ou excessivos

Oposição ao tratamento em hipóteses permitidas por lei

Revogação do consentimento, quando aplicável

5. SEGURANÇA DA INFORMAÇÃO
5.1. Medidas adotadas

A Play Prêmios adota medidas técnicas e administrativas adequadas para proteger os dados pessoais, incluindo:

Criptografia de dados em trânsito e em repouso

Armazenamento seguro de senhas por meio de hash criptográfico

Uso de certificados SSL/TLS

Monitoramento contínuo e práticas de segurança da informação

6. CONTATO E ENCARREGADO DE DADOS (DPO)

Para dúvidas, solicitações ou exercício de direitos relacionados à LGPD:

E-mail: contato@playpremios.com

Horário de atendimento: Segunda a sexta, das 9h às 18h

Prazo de resposta: até 15 dias úteis

© 2026 Play Prêmios – Plataforma de Sorteios Online.
Todos os direitos reservados.

Última atualização: 03/01/2026`}
                    </div>
                </Modal>
            )}

            {/* Terms Modal */}
            {showTerms && (
                <Modal title="Termos de Uso" icon={<Gavel className="w-5 h-5 text-blue-500" />} onClose={() => setShowTerms(false)}>
                    <div className="text-sm text-stone-300 whitespace-pre-wrap leading-relaxed">
                        {`Termos de Uso – Play Prêmios

Data de atualização: 03/01/2026
Versão: 1.0

1. ACEITAÇÃO DOS TERMOS

Ao acessar ou utilizar a plataforma Play Prêmios, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso e com a Política de Privacidade. Caso não concorde, deverá interromper imediatamente o uso da plataforma.

2. DEFINIÇÕES

Plataforma: sistema digital Play Prêmios

Usuário: pessoa física cadastrada na plataforma

Sorteio: campanha promocional com distribuição de prêmios por meio de sorteio

Participação: inscrição válida em um sorteio específico

Administrador: responsável pela criação, configuração e gestão dos sorteios

3. DESCRIÇÃO DOS SERVIÇOS

A Play Prêmios disponibiliza:

Cadastro de usuários e participação em sorteios

Geração automática de números da sorte

Acompanhamento de sorteios ativos e finalizados

Divulgação de resultados e notificações

Painel administrativo para criação e gestão de campanhas

4. CADASTRO E ELEGIBILIDADE
4.1. Requisitos

Para utilizar a plataforma, o usuário deve:

Ter 18 anos ou mais, ou autorização legal dos responsáveis

Residir em território brasileiro

Fornecer informações verdadeiras e atualizadas

Possuir documento de identificação válido

Aceitar estes Termos e a Política de Privacidade

4.2. Responsabilidades do usuário

O usuário compromete-se a:

Manter seus dados atualizados

Utilizar a plataforma de forma ética e legal

Não criar múltiplas contas

Manter a confidencialidade de suas credenciais

Não interferir ou tentar comprometer a segurança do sistema

5. REGRAS DOS SORTEIOS
5.1. Participação

Cada usuário pode participar apenas uma vez por sorteio

A participação é gratuita, salvo indicação expressa em contrário

Os números da sorte são gerados automaticamente

Não é permitida a transferência de participações

5.2. Realização

Sorteios ocorrem na data e horário informados

O processo é transparente e passível de auditoria

Resultados são divulgados na plataforma

Em caso de empate, será realizado novo sorteio

5.3. Prêmios

Os prêmios seguem a descrição de cada campanha

Ganhadores serão contatados pelos dados cadastrados

Prazo para resposta: até 72 horas

Prêmios não reclamados poderão ser redistribuídos

6. CONDUTAS PROIBIDAS

É vedado ao usuário:

Utilizar robôs, scripts ou automações

Criar contas falsas ou usar dados de terceiros

Manipular ou tentar fraudar sorteios

Fornecer informações falsas

Comercializar participações

Praticar atos ilegais ou que prejudiquem a plataforma

7. PROTEÇÃO DE DADOS

O tratamento de dados pessoais segue rigorosamente a LGPD, assegurando:

Coleta mínima e necessária

Uso exclusivo para as finalidades informadas

Armazenamento seguro

Exercício dos direitos do titular

8. PROPRIEDADE INTELECTUAL

Todo o conteúdo da plataforma, incluindo código-fonte, layout, marcas e textos, é de propriedade da Play Prêmios, sendo vedada sua reprodução ou uso sem autorização prévia.

9. LIMITAÇÃO DE RESPONSABILIDADE

A Play Prêmios não se responsabiliza por:

Indisponibilidades temporárias do sistema

Danos indiretos, lucros cessantes ou prejuízos consequenciais

A responsabilidade limita-se à transparência dos sorteios, proteção de dados e entrega dos prêmios conforme regulamento.

10. SUSPENSÃO E CANCELAMENTO

Contas poderão ser suspensas ou encerradas em caso de:

Violação destes Termos

Atividades suspeitas ou fraudulentas

Uso indevido da plataforma

O usuário pode solicitar o cancelamento da conta a qualquer momento.

11. ALTERAÇÕES DOS TERMOS

Os Termos poderão ser atualizados periodicamente. Alterações relevantes serão comunicadas com antecedência mínima de 30 dias. O uso contínuo implica concordância com as novas versões.

12. LEI APLICÁVEL E FORO

Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de domicílio da empresa para dirimir eventuais controvérsias.

13. CONTATO

E-mail: contato@playpremios.com

Encarregado de Dados (DPO): contato@playpremios.com

© 2026 Play Prêmios – Plataforma de Sorteios Online.
Todos os direitos reservados.`}
                    </div>
                </Modal>
            )}
        </>
    );
}

// Reusable Modal Component
function Modal({ title, icon, onClose, children }: { title: string, icon: React.ReactNode, onClose: () => void, children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900/50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {icon}
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-white transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
                <div className="p-4 border-t border-stone-800 bg-stone-900/50 text-center flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm w-full"
                    >
                        Entendi, fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
