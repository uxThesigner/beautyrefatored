// ======================================================
// config.js - White-label (dados do cliente)
// Cliente configurado: Beauty Esthetica (padrão)
// ======================================================
//
// Como usar para outro cliente:
// 1) Edite os campos em window.APP_CONFIG (nome, contatos, links, etc.)
// 2) Troque as listas em APP_CONFIG.data (serviços, produtos, cupons, parceiros, promoções)
// 3) (Opcional) Ajuste APP_CONFIG.seo.pages (títulos/descrições por página)
// 4) Deploy na Vercel.
//
// Observação: este projeto é 100% estático. SEO "dinâmico" via JS é útil para padronizar
// rapidamente o white-label, mas se você quiser SEO máximo, mantenha as metas no HTML também.

(function () {
  window.WL = window.WL || {};

  const APP_CONFIG = {
    client: {
      id: "beauty-esthetica",
      name: "Beauty Esthetica",
      segment: "clinica-estetica"
    },

    site: {
      url: "https://beautyesthetica.com.br"
    },

    business: {
      name: "Beauty Esthetica",
      ownerName: "Hillary Vitória",
      tagline: "Clínica de Estética e Skincare Avançado",
      clubLabel: "Beauty Club",
      promotionsLabel: "PromoBeauty",
      about: "Realce sua beleza natural com tratamentos estéticos personalizados e produtos de alta performance. Bem-estar e tecnologia ao seu alcance.",
      cnpj: "63.528.048/0001-97",
      address: "Rua Campos, 371 - São José, Aracaju - SE | CEP: 49015-220",
      addressMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Campos+371+Sao+Jose+Aracaju+SE+49015-220",
      phoneDisplay: "(79) 98135-4300",
      city: "Aracaju",
      state: "SE"
    },

    contacts: {
      whatsapp: {
        number: "5579981354300",      // formato: 55DDDNÚMERO (sem + e sem espaços)
        display: "+55 (79) 98135-4300",
        url: "https://wa.me/5579981354300"
      },
      instagram: {
        handle: "beautyesthetica_",
        url: "https://instagram.com/beautyesthetica_"
      },
      email: "contato@beautyesthetica.com.br"
    },

    links: {
      terms: "termos.html",
      privacy: "politica.html",
      club: "clube.html",
      partners: "parceiro.html",
      promotions: "promocoes.html",
      gift: "presente.html"
    },

    features: {
      club: true,
      partners: true,
      promotions: true,
      coupons: true,
      gift: true,
      portfolio: true
    },

    whiteLabel: {
      // Ajuda a "trocar a skin" sem precisar sair caçando textos no HTML.
      // Se você reaproveitar esse mesmo código para outro cliente, basta editar os campos acima
      // e ajustar esses tokens se houver palavras/labels específicas.
      textReplacements: [
        { from: "Beauty Esthetica", to: "{{business.name}}" },
        { from: "BEAUTY ESTHETICA", to: "{{business.name|upper}}" },
        { from: "Beauty Club", to: "{{business.clubLabel}}" },
        { from: "BEAUTY CLUB", to: "{{business.clubLabel|upper}}" },
        { from: "PromoBeauty", to: "{{business.promotionsLabel}}" },
        { from: "PROMOBEAUTY", to: "{{business.promotionsLabel|upper}}" }
      ]
    },

    analytics: {
      ga4MeasurementId: "G-J76K9ERGHV"  // defina null/"" para desativar
    },

    seo: {
      defaultDescription: "Realce sua beleza natural na Beauty Esthetica. Tratamentos faciais, corporais, massagens relaxantes e uma linha exclusiva de produtos de skincare de alta performance. Agende sua avaliação!",
      defaultOgImage: "imagens/Banners/herobusca.jpg",
      googleSiteVerification: "KCjdN2ZGfbiZPJb-19ze1Z34jc1j9nUuPn_pZYQx9J0",
      pages: {
  "404.html": {
    "title": "Página não encontrada | Beauty Esthetica",
    "robots": "noindex, follow"
  },
  "avaliacao.html": {
    "title": "Avaliação Gratuita | Beauty Esthetica",
    "description": "Faça nossa Anamnese Virtual Gratuita. Descubra o protocolo ideal para sua pele ou corpo na Beauty Esthetica.",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "busca.html": {
    "title": "Busca | Beauty Esthetica",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "carrinho.html": {
    "title": "Seu Carrinho | Beauty Esthetica",
    "robots": "noindex, follow"
  },
  "clube.html": {
    "title": "Beauty Club | Escolha seu Plano VIP",
    "description": "Entre para o Beauty Club. Escolha entre os níveis Bronze, Prata ou Ouro e tenha pele perfeita e descontos exclusivos todo mês.",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "index.html": {
    "title": "Beauty Esthetica | Clínica de Estética e Skincare Avançado",
    "description": "Realce sua beleza natural na Beauty Esthetica. Tratamentos faciais, corporais, massagens relaxantes e uma linha exclusiva de produtos de skincare de alta performance. Agende sua avaliação!",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "links.html": {
    "title": "Links | Beauty Esthetica",
    "description": "Agende seu horário, confira promoções, compre vale-presente e saiba onde nos encontrar.",
    "og_image": "imagens/Banners/hillary.jpg"
  },
  "obrigado.html": {
    "title": "Pedido Iniciado! | Beauty Esthetica",
    "robots": "noindex, follow"
  },
  "pagamento.html": {
    "title": "Finalizar Agendamento | Beauty Esthetica",
    "robots": "noindex, follow"
  },
  "parceiro.html": {
    "title": "Parceiro | Beauty Esthetica",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "politica.html": {
    "title": "Política de Privacidade | Beauty Esthetica",
    "description": "Política de Privacidade e Termos de Uso da Beauty Esthetica. Saiba como tratamos seus dados com segurança e transparência.",
    "robots": "noindex, follow"
  },
  "prazos.html": {
    "title": "Prazos e Entregas | Beauty Esthetica",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "presente.html": {
    "title": "Vale Presente | Beauty Esthetica",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "produtos.html": {
    "title": "Detalhes do Produto | Beauty Esthetica",
    "description": "Compre na Beauty Esthetica",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "promocoes.html": {
    "title": "PromoBeauty | Combos e Ofertas Beauty Esthetica",
    "description": "Confira a PromoBeauty! Descontos exclusivos em combos de estética, kits de skincare e tratamentos. Ofertas por tempo limitado. Aproveite!",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "quem-somos.html": {
    "title": "Quem Somos | Beauty Esthetica",
    "description": "Conheça a Beauty Esthetica e a especialista Hillary Vitória. Nossa missão é realçar sua beleza natural com tecnologia e acolhimento.",
    "og_image": "imagens/Banners/herobusca.jpg"
  },
  "termos.html": {
    "title": "Termos de Uso | Beauty Esthetica",
    "og_image": "imagens/Banners/herobusca.jpg"
  }
}
    },

    // ------------------------------------------------------
    // DADOS DO CATÁLOGO E CONTEÚDO (100% client-specific)
    // ------------------------------------------------------
    data: {
      services: [
    // --- CORPORAL ---
    {
        id: 'serv-depilacao-corp',
        image: 'imagens/Servicos/depilacao-corporal.jpg',
        name: 'Depilação a Laser Corporal',
        price: 49.90, 
        rating: 5.0, reviews: 120, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: 'Laser Alexandrite / ND:Yag',
        colors: [],
        coupon: 'LISINHA', stock: 999,
        tags: ['corporal', 'depilacao', 'laser', 'servico'],
        description: 'Utilizamos a tecnologia mais avançada do mercado (Alexandrite ou ND:Yag) que atinge a raiz do pelo através da atração por melanina. O processo conta com uma ponteira resfriada a -10ºC que protege a pele e garante uma aplicação confortável, eliminando foliculite e pelos encravados definitivamente.',
        usage: 'PRÉ: Raspe os pelos com lâmina 1 dia antes. A pele não pode estar bronzeada. Intervalo de 30 a 45 dias entre sessões.',
        care: 'PÓS: Evite sol na área por 7 dias. Use hidratante calmante. Não arranque os pelos com pinça ou cera entre as sessões.',
        region_prices: [
            { name: "Axila", price: 69.90 },
            { name: "Virilha", price: 49.90 },
            { name: "Braço", price: 99.90 },
            { name: "Coxa", price: 79.90 },
            { name: "Canela", price: 79.90 },
            { name: "Abdômen", price: 119.90 },
            { name: "Perna Completa", price: 149.90 }
        ]
    },
    {
        id: 'serv-drenagem',
        image: 'imagens/Servicos/drenagem.jpg',
        name: 'Drenagem Linfática (Método Renata França)',
        price: 94.90,
        price_package: 269.90,
        rating: 4.9, reviews: 85, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Corpo Todo'],
        coupon: 'DETOX', stock: 999,
        tags: ['corporal', 'drenagem', 'massagem', 'inchaço', 'servico'],
        description: 'Técnica manual com pressão firme e ritmo acelerado, além de bombeamentos e manobras exclusivas. O objetivo é desinchar instantaneamente, estimulando o sistema linfático a eliminar o excesso de fluidos e toxinas do corpo.',
        usage: 'Indicado para retenção de líquidos, sensação de peso nas pernas, gestantes e pós-operatório.',
        care: 'Ingerir pelo menos 500ml de água logo após a sessão para auxiliar na eliminação das toxinas via urina.'
    },
    {
        id: 'serv-gessoterapia',
        image: 'imagens/Servicos/gessoterapia.jpg',
        name: 'Gessoterapia (Lipo Escultura Gessada)',
        price: 84.90,
        price_package: 249.90,
        rating: 4.8, reviews: 40, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Abdômen', 'Coxas'],
        coupon: 'MEDIDAS', stock: 999,
        tags: ['corporal', 'gessoterapia', 'emagrecimento', 'servico'],
        description: 'Tratamento ortomolecular que utiliza um gesso enriquecido com ativos lipolíticos. Ao endurecer, o gesso promove uma oclusão que "aquece" e "esfria" a região, acelerando o metabolismo local e compactando o tecido adiposo.',
        usage: 'Ideal para remodelagem corporal urgente e redução de medidas pré-eventos.',
        care: 'Manter o gesso pelo tempo orientado (mínimo 3h). Evitar banhos quentes na região no dia da aplicação.'
    },
    {
        id: 'serv-jato-estrias',
        image: 'imagens/Servicos/jato-plasma.jpg',
        name: 'Jato de Plasma (Estrias e Flacidez)',
        price: 99.90,
        price_package: 289.90,
        rating: 4.9, reviews: 30, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Área Específica'],
        coupon: 'PELEFIRME', stock: 999,
        tags: ['corporal', 'jato de plasma', 'estrias', 'flacidez', 'servico'],
        description: 'O plasma (quarto estado da matéria) promove uma sublimação controlada da pele. Isso gera uma retração imediata (efeito lifting) e estimula uma produção intensa de colágeno novo, preenchendo estrias e firmando a pele flácida.',
        usage: 'PRÉ: Vir com a pele limpa, sem cremes. Intervalo de 30 a 45 dias entre sessões.',
        care: 'PÓS: Formarão casquinhas que caem em 5-7 dias. NÃO arrancar. Usar reparador (Cicaplast/Bepantol) e Protetor Solar rigorosamente.'
    },
    {
        id: 'serv-jato-sinais-corp',
        image: 'imagens/Servicos/jato-sinais.jpg',
        name: 'Jato de Plasma (Sinais e Verrugas)',
        price: 79.90,
        price_package: 229.90,
        rating: 5.0, reviews: 25, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '40 minutos',
        colors: ['Por Região'],
        coupon: 'LIMPEZA', stock: 999,
        tags: ['corporal', 'sinais', 'verrugas', 'jato de plasma', 'servico'],
        description: 'Remoção estética de acrocórdons (verrugas pingentes), sinais benignos e manchas senis através da cauterização superficial. O procedimento é rápido, suportável (usamos anestésico tópico) e sem cortes.',
        usage: 'Necessária avaliação prévia para confirmar que a lesão é benigna/estética.',
        care: 'A área ficará com uma crosta escura. Mantenha limpa e seca. Use reparador dérmico até a cicatrização total.'
    },
    {
        id: 'serv-massagem-relax',
        image: 'imagens/Servicos/massagem.jpg',
        name: 'Massagem Relaxante Aromaterapêutica',
        price: 84.90,
        price_package: 249.90,
        rating: 5.0, reviews: 150, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Corpo Todo'],
        coupon: 'RELAX', stock: 999,
        tags: ['corporal', 'massagem', 'relaxamento', 'servico'],
        description: 'Uma experiência sensorial completa. Combinamos movimentos suaves e deslizantes com óleos essenciais escolhidos para sua necessidade (lavanda para acalmar, alecrim para energia, etc). Foca em aliviar a tensão muscular, reduzir o cortisol e melhorar o sono.',
        usage: 'Indicado para estresse, ansiedade, insônia ou dores musculares leves.',
        care: 'Recomendamos um banho morno antes de vir. Após a massagem, evite atividades físicas intensas para prolongar o relaxamento.'
    },
    {
        id: 'serv-massagem-modeladora',
        image: 'imagens/Servicos/massagem-modeladora.jpg',
        name: 'Massagem Modeladora Power',
        price: 94.90,
        price_package: 269.90,
        rating: 4.8, reviews: 65, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Corpo Todo'],
        coupon: 'MODELAR', stock: 999,
        tags: ['corporal', 'massagem', 'modeladora', 'gordura', 'servico'],
        description: 'Manobras rápidas, profundas e vigorosas focadas nas áreas de acúmulo de gordura (culote, abdômen, braços). O objetivo é reorganizar o tecido adiposo, melhorar a oxigenação e desenhar as curvas do corpo.',
        usage: 'Ideal para quem busca definição de contorno corporal. Pode causar leve desconforto durante a execução.',
        care: 'Pode ocorrer vermelhidão temporária (hiperemia) e pequenos hematomas, o que é normal devido à intensidade.'
    },
    {
        id: 'serv-micro-corp',
        image: 'imagens/Servicos/microagulhamento.jpg',
        name: 'Microagulhamento Corporal (Dermaroller)',
        price: 119.90,
        price_package: 329.90,
        rating: 4.9, reviews: 20, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Estrias', 'Flacidez'],
        coupon: 'RENOVA', stock: 999,
        tags: ['corporal', 'microagulhamento', 'estrias', 'colageno', 'servico'],
        description: 'Técnica de indução percutânea de colágeno. Microagulhas estéreis criam microcanais na pele, permitindo a infusão de ativos (Drug Delivery) e obrigando a pele a se regenerar, tratando estrias brancas e flacidez.',
        usage: 'PRÉ: Suspender ácidos na região 3 dias antes.',
        care: 'PÓS: Proibido sol por 15 dias. A pele vai descamar levemente. Hidratação intensa obrigatória após 24h.'
    },
    {
        id: 'serv-detox',
        image: 'imagens/Servicos/detox.jpg',
        name: 'Protocolo Detox Corporal',
        price: 79.90,
        price_package: 229.90,
        rating: 4.8, reviews: 35, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Corpo Todo'],
        coupon: 'DETOX', stock: 999,
        tags: ['corporal', 'detox', 'emagrecimento', 'servico'],
        description: 'O primeiro passo para quem quer emagrecer. Inclui: Esfoliação corporal completa + Manta Térmica com ativos + Drenagem. Elimina toxinas, reduz o inchaço e prepara o corpo para responder melhor a outros tratamentos.',
        usage: 'Indicado antes de iniciar pacotes de gordura localizada ou após finais de semana de exageros.',
        care: 'Beba muita água (2 a 3 litros) nas 24h seguintes para ajudar na eliminação das toxinas.'
    },
    {
        id: 'serv-enzimas',
        image: 'imagens/Servicos/enzimas.jpg',
        name: 'Lipo Enzimática (Aplicação de Enzimas)',
        price: 119.90,
        price_package: 359.90,
        rating: 5.0, reviews: 18, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '30/40 minutos',
        colors: ['Gordura Localizada'],
        coupon: 'LIPO', stock: 999,
        tags: ['corporal', 'enzimas', 'gordura', 'emagrecimento', 'servico'],
        description: 'Aplicação intradérmica localizada de um blend de ativos lipolíticos (quebradores de gordura). As enzimas agem diretamente na célula de gordura, facilitando sua eliminação pelo metabolismo.',
        usage: 'Indicado para gordura resistente (aquela que não sai com academia). Sessões semanais.',
        care: 'Não massagear a área por 24h. Evitar anti-inflamatórios (cortam o efeito). Fazer atividade física potencializa o resultado.'
    },
    {
        id: 'serv-pump',
        image: 'imagens/Servicos/pump-up.jpg',
        name: 'Pump Up (Levanta Bumbum)',
        price: 94.90,
        price_package: 269.90,
        rating: 4.9, reviews: 42, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '40 minutos',
        colors: ['Glúteos'],
        coupon: 'BUMBUM', stock: 999,
        tags: ['corporal', 'pump', 'gluteos', 'servico'],
        description: 'Uso de ventosas especiais que promovem sucção e soltura nos glúteos. Estimula a circulação, quebra celulites e promove um "inchaço" modelador imediato, além de estimular a musculatura.',
        usage: 'Efeito Cinderela (imediato) e tratamento a longo prazo para celulite.',
        care: 'Pode deixar marcas roxas temporárias (sucção). Não substitui o treino de agachamento.'
    },
    {
        id: 'serv-clareamento-corp',
        image: 'imagens/Servicos/clareamento-corp.jpg',
        name: 'Clareamento de Áreas Íntimas/Corporais',
        price: 0.00, 
        price_package: 0.00,
        rating: 4.8, reviews: 12, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '30/40 minutos',
        colors: ['Axila', 'Virilha', 'Joelhos'],
        coupon: 'CLARA', stock: 999,
        tags: ['corporal', 'clareamento', 'manchas', 'servico'],
        description: 'Protocolo exclusivo combinando peeling químico (ácidos clareadores) e peeling físico para renovar a pele escurecida por atrito ou depilação. *Valor sob consulta após avaliação.*',
        usage: 'Axilas, virilhas, cotovelos e joelhos escurecidos.',
        care: 'PRÉ: Não depilar 2 dias antes. PÓS: Proibido sol na área. Uso de desodorantes sem álcool e roupas de algodão.'
    },
    
    // --- NOVOS SERVIÇOS CORPORAIS (Inseridos Aqui) ---
    {
        id: 'serv-lipocav',
        image: 'imagens/Servicos/lipocavitacao.jpg',
        name: 'Lipocavitação (Lipo Sem Cortes)',
        price: 79.90,
        price_package: 229.90,
        rating: 4.9, reviews: 32, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '40 minutos',
        colors: ['Abdômen', 'Flancos', 'Coxas'],
        coupon: 'LIPO', stock: 999,
        tags: ['corporal', 'lipo', 'gordura', 'emagrecimento', 'servico'],
        description: 'Conhecida como "Lipo sem Cortes". Utilizamos ultrassom focado de alta potência que agita as células de gordura até que elas implodam (cavitação), transformando a gordura sólida em líquida para ser eliminada pelo organismo.',
        usage: 'A melhor opção para aquela gordura localizada difícil que não sai com dieta.',
        care: 'REGRA DE OURO: É obrigatório fazer atividade física aeróbica (caminhada/corrida) em até 24h após a sessão para "queimar" a gordura liberada.'
    },
    {
        id: 'serv-ems',
        image: 'imagens/Servicos/ems.jpg',
        name: 'EMS (Eletroestimulação Muscular)',
        price: 79.90,
        price_package: 229.90,
        rating: 5.0, reviews: 28, collection: 'Corporal',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '30 minutos',
        colors: ['Abdômen', 'Glúteos', 'Pernas'],
        coupon: 'TONUS', stock: 999,
        tags: ['corporal', 'musculo', 'flacidez', 'definicao', 'servico'],
        description: 'A "Academia Passiva". Tecnologia que envia impulsos elétricos profundos, provocando contrações musculares intensas (semelhante a um treino pesado). Tonifica o músculo, combate a flacidez tissular e melhora a circulação.',
        usage: 'Ideal para quem quer definição muscular ("tanquinho"), levantar o bumbum ou tratar flacidez pós-emagrecimento.',
        care: 'Sensação de formigamento intenso é normal. Manter hidratação para condução dos impulsos.'
    },
    {
        id: 'serv-combo-lipo-ems',
        image: 'imagens/Servicos/combo-lipo-ems.jpg',
        name: 'COMBO: Lipo Sem Cortes + EMS',
        price: 119.90,
        price_package: 349.90, // 3x do Combo
        rating: 5.0, reviews: 150, collection: 'Corporal',
        sizes: ['Sessão Combo', 'Pacote 3 Combos'],
        material: '1h 10min',
        colors: ['Protocolo Duplo'],
        coupon: 'COMBOVIP', stock: 999,
        tags: ['corporal', 'combo', 'emagrecimento', 'promocao', 'servico'],
        description: 'O protocolo perfeito de redução de medidas. Unimos a Lipocavitação (que quebra a gordura) com a EMS (que queima a energia e firma o músculo). Resultado: Menos gordura e mais firmeza na mesma sessão.',
        usage: 'Indicado para otimizar resultados. Economize R$ 40,00 por sessão comparado aos avulsos.',
        care: 'Obrigatório atividade física após a sessão para metabolização da gordura.'
    },

    // --- FACIAL ---
    {
        id: 'serv-depilacao-facial',
        image: 'imagens/Servicos/depilacao-facial.jpg',
        name: 'Depilação a Laser Facial',
        price: 79.90,
        price_package: 229.90,
        rating: 4.9, reviews: 50, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '20/30 minutos',
        colors: ['Rosto Total', 'Buço/Queixo'],
        coupon: 'LISINHA', stock: 999,
        tags: ['facial', 'depilacao', 'laser', 'servico'],
        description: 'Tecnologia segura para a pele delicada do rosto. Elimina o "bigodinho" e pelos no queixo, clareando a região e acabando com a foliculite. Ponteira resfriada para maior conforto.',
        usage: 'PRÉ: Não usar ácidos no rosto 5 dias antes. Não arrancar os pelos com pinça.',
        care: 'PÓS: Uso de protetor solar FPS 50 a cada 3 horas é obrigatório. Evitar maquiagem logo após.'
    },
    {
        id: 'serv-acne',
        image: 'imagens/Servicos/acne.jpg',
        name: 'Gerenciamento de Acne (Limpeza + Peeling)',
        price: 84.90,
        price_package: 249.90,
        rating: 5.0, reviews: 40, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Grau I e II', 'Grau III'],
        coupon: 'ACNEFREE', stock: 999,
        tags: ['facial', 'acne', 'limpeza', 'servico'],
        description: 'Protocolo secativo e anti-inflamatório. Inclui higienização, extração de comedões, aplicação de alta frequência (ozônio), peeling químico (ácido salicílico/mandélico) e máscara de argila verde ou ledterapia azul.',
        usage: 'Para peles oleosas, com espinhas ativas ou cravos recorrentes.',
        care: 'Não espremer espinhas em casa! Lavar o rosto com sabonete específico e evitar sol direto.'
    },
    {
        id: 'serv-melasma',
        image: 'imagens/Servicos/melasma.jpg',
        name: 'Gerenciamento de Melasma',
        price: 99.90, 
        price_package: 299.90, 
        rating: 4.8, reviews: 55, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Padrão'],
        coupon: 'CLAREAR', stock: 999,
        tags: ['facial', 'melasma', 'manchas', 'servico'],
        description: 'Tratamento de controle. O melasma não tem cura, mas tem clareamento. Usamos blend de ácidos tranexâmico e kójico, microagulhamento leve ou peeling vulcânico para dispersar o pigmento sem efeito rebote.',
        usage: 'Sessões quinzenais ou mensais.',
        care: 'O sol é seu inimigo. Protetor solar com COR (barreira física) deve ser usado mesmo dentro de casa, reaplicado 3x ao dia.'
    },
    {
        id: 'serv-limpeza',
        image: 'imagens/Servicos/limpeza.jpg',
        name: 'Limpeza de Pele Profunda Premium',
        price: 84.90, 
        price_package: 254.90, 
        rating: 5.0, reviews: 200, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1h 30min',
        colors: ['Todos os Tipos'],
        coupon: 'LIMPEZA', stock: 999,
        tags: ['facial', 'limpeza', 'cravos', 'servico'],
        description: 'O passo zero de qualquer skincare. 1. Higienização; 2. Esfoliação; 3. Vapor de Ozônio (abertura de poros); 4. Extração manual meticulosa; 5. Alta Frequência (bactericida); 6. Máscara de tratamento conforme seu tipo de pele; 7. Massagem facial final.',
        usage: 'Mensalmente para manutenção da saúde da pele.',
        care: 'Não usar maquiagem por 24h (para não obstruir os poros limpos). Trocar a fronha do travesseiro à noite.'
    },
    {
        id: 'serv-micro-manchas',
        image: 'imagens/Servicos/micro-facial.jpg',
        name: 'Microagulhamento Facial (Cicattrizes e Poros)',
        price: 114.90,
        price_package: 329.90,
        rating: 4.9, reviews: 30, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Rosto Total'],
        coupon: 'RENOVA', stock: 999,
        tags: ['facial', 'microagulhamento', 'manchas', 'cicatriz', 'servico'],
        description: 'Estimulação intensa de colágeno. O dispositivo com microagulhas abre canais para entrada de vitamina C, ácido hialurônico e fatores de crescimento. Melhora textura, poros dilatados e cicatrizes de acne.',
        usage: 'PRÉ: Vir sem maquiagem. Anestésico tópico é aplicado 20min antes.',
        care: 'PÓS: Vermelhidão dura 1-2 dias. Proibido sol e maquiagem por 48h. Usar apenas os produtos indicados pela profissional.'
    },
    {
        id: 'serv-micro-cabelo',
        image: 'imagens/Servicos/capilar.jpg',
        name: 'Microagulhamento Capilar (Queda)',
        price: 114.90,
        price_package: 329.90,
        rating: 5.0, reviews: 15, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Couro Cabeludo', 'Sobrancelha'],
        coupon: 'CRESCER', stock: 999,
        tags: ['facial', 'capilar', 'cabelo', 'microagulhamento', 'servico'],
        description: 'Terapia de indução de crescimento. Microagulhamos o couro cabeludo ou sobrancelha para aplicar fatores de crescimento e minoxidil injetável direto no bulbo (Drug Delivery). Aumenta a vascularização e força do fio.',
        usage: 'Indicado para eflúvio telógeno (queda por estresse/pós-covid) e falhas.',
        care: 'Vir com cabelo lavado. Não lavar o cabelo por 24h após o procedimento. Não usar boné/chapéu no dia.'
    },
    {
        id: 'serv-micro-rugas',
        image: 'imagens/Servicos/micro-rugas.jpg',
        name: 'Microagulhamento Anti-Aging (Rugas)',
        price: 99.90,
        price_package: 299.90,
        rating: 5.0, reviews: 20, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Sulco/Rugas'],
        coupon: 'YOUNG', stock: 999,
        tags: ['facial', 'microagulhamento', 'rugas', 'rejuvenescimento', 'servico'],
        description: 'Focado em linhas finas e "bigode chinês". A injúria controlada das agulhas obriga a pele a produzir colágeno novo, "esticando" a pele e suavizando as marcas do tempo.',
        usage: 'Intervalo mensal. Resultados visíveis a partir da 2ª sessão.',
        care: 'Hidratação constante com ácido hialurônico nos dias seguintes é essencial para o resultado.'
    },
    {
        id: 'serv-peeling-diamante',
        image: 'imagens/Servicos/diamante.jpg',
        name: 'Peeling de Diamante (Microdermoabrasão)',
        price: 79.90, 
        price_package: 239.90, 
        rating: 4.7, reviews: 45, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Padrão'],
        coupon: 'GLOW', stock: 999,
        tags: ['facial', 'peeling', 'esfoliacao', 'servico'],
        description: 'Esfoliação mecânica profunda. Uma ponteira diamantada "lixa" delicadamente a camada superficial da pele, removendo células mortas, clareando manchas superficiais e deixando o toque aveludado imediatamente.',
        usage: 'Pode ser feito a cada 15 ou 30 dias. Ótimo pré-maquiagem para eventos.',
        care: 'A pele fica mais fina e sensível. Protetor solar é indispensável.'
    },
    {
        id: 'serv-nano',
        image: 'imagens/Servicos/nano.jpg',
        name: 'Nano Hidratação (Glow Skin)',
        price: 89.90,
        price_package: 259.90,
        rating: 5.0, reviews: 60, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Padrão'],
        coupon: 'HIDRA', stock: 999,
        tags: ['facial', 'hidratacao', 'glow', 'servico'],
        description: 'Devolve a água e o viço da pele. Utilizamos tecnologia de nanopartículas que penetram profundamente sem agulhas. Inclui esfoliação, massagem facial lifting e máscara de hidratação profunda.',
        usage: 'Sempre que sentir a pele opaca, ressecada ou "craquelando" a maquiagem.',
        care: 'Manter a ingestão de água e rotina de skincare em casa.'
    },
    {
        id: 'serv-jato-facial',
        image: 'imagens/Servicos/sinais-facial.jpg',
        name: 'Remoção de Sinais Facial (Jato de Plasma)',
        price: 0.00, 
        price_package: 0.00,
        rating: 4.9, reviews: 22, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Por Região'],
        coupon: 'LIMPEZA', stock: 999,
        tags: ['facial', 'sinais', 'verrugas', 'jato de plasma', 'servico'],
        description: 'Técnica precisa para remoção de verrugas planas, miliums resistentes e sinais no rosto. Procedimento feito com anestésico tópico, praticamente indolor e com cicatrização rápida. *Valor sob consulta.*',
        usage: 'Avaliação obrigatória para verificação do tipo de lesão.',
        care: 'Não arrancar a casquinha. Proteger do sol com micropore ou protetor físico até a cicatrização.'
    },
    {
        id: 'serv-micropig',
        image: 'imagens/Servicos/micropigmentacao.jpg',
        name: 'Micropigmentação Labial (Neutralização/Cor)',
        price: 99.90,
        price_package: 299.90,
        rating: 5.0, reviews: 10, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '2h 30min',
        colors: ['Cor a definir'],
        coupon: 'LIPS', stock: 999,
        tags: ['facial', 'boca', 'labios', 'micropigmentacao', 'servico'],
        description: 'Implantação de pigmento na camada superficial dos lábios. Pode ser efeito Batom (mais cor), Aquarela (natural) ou Neutralização (para lábios arroxeados/escuros). Define o contorno e dá cor de "saúde".',
        usage: 'PRÉ: Hidratar muito os lábios 3 dias antes. Se tiver histórico de herpes, tomar antiviral preventivo (consulte médico).',
        care: 'PÓS: Não beijar, não comer coisas quentes/ácidas por 48h. Manter hidratado com pomada específica.'
    },
    {
        id: 'serv-hidralips',
        image: 'imagens/Servicos/hidralips.jpg',
        name: 'Hidralips (Hidratação Labial Profunda)',
        price: 84.90,
        price_package: 254.90,
        rating: 4.8, reviews: 15, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 3 Sessões'],
        material: '1 hora',
        colors: ['Padrão'],
        coupon: 'LIPS', stock: 999,
        tags: ['facial', 'boca', 'labios', 'hidratacao', 'servico'],
        description: 'O "spa dos lábios". Remove pelinhas mortas com esfoliação suave e aplica ácido hialurônico e vitaminas com dermapen (microagulhamento indolor). Devolve o volume por hidratação e deixa os lábios macios e lisinhos.',
        usage: 'Lábios ressecados, com rachaduras ou antes de usar batom matte.',
        care: 'Usar lip balm ou manteiga de cacau várias vezes ao dia para manter o efeito.'
    },
    
    // --- NOVO SERVIÇO FACIAL (Inserido Aqui) ---
    {
        id: 'serv-lifting-infra',
        image: 'imagens/Servicos/lifting-infra.jpg',
        name: 'Lifting Facial com Infravermelho',
        price: 79.90,
        price_package: 319.90, // Pacote de 4 sessões conforme solicitado
        rating: 4.8, reviews: 19, collection: 'Facial',
        sizes: ['Sessão Única', 'Pacote 4 Sessões'],
        material: '50 minutos',
        colors: ['Rosto', 'Pescoço'],
        coupon: 'LIFT', stock: 999,
        tags: ['facial', 'lifting', 'flacidez', 'rejuvenescimento', 'servico'],
        description: 'Rejuvenescimento térmico não-invasivo. A luz infravermelha aquece as camadas profundas da derme, contraindo as fibras existentes (efeito lifting imediato) e estimulando a produção de novo colágeno a longo prazo.',
        usage: 'Para flacidez de pele, "papada", rugas finas e melhora do contorno facial.',
        care: 'Procedimento indolor e sem tempo de recuperação ("Downtime zero"). Pode voltar ao trabalho imediatamente. Usar protetor solar.'
    }
],
      products: [
    {
        id: 'prod-sabonete-antiacne',
        image: 'imagens/Produtos/sabonete-esfoliante-antiacne.jpg',
        name: 'Sabonete Esfoliante Antiacne 80ml',
        price: 28.90, 
        rating: 4.8, reviews: 32, collection: 'Home Care',
        sizes: ['80ml'], material: 'Ácido Salicílico + Extratos', colors: ['Pele Acneica'],
        coupon: 'ACNEFREE', stock: 0,
        tags: ['produto', 'sabonete', 'rosto', 'acne', 'oleosidade', 'esfoliante'],
        description: 'Limpeza profunda e controle da oleosidade. Sua fórmula com ácido salicílico desobstrui os poros.',
        usage: 'Use 2 a 3 vezes por semana.',
        care: 'Evite a área dos olhos.'
    },
    {
        id: 'prod-sabonete-esfoliante-vitc',
        image: 'imagens/Produtos/sabonete-esfoliante-vitamina-c.jpg',
        name: 'Sabonete Esfoliante Vitamina C 80ml',
        price: 29.90,
        rating: 4.9, reviews: 45, collection: 'Home Care',
        sizes: ['80ml'], material: 'Nanotecnologia', colors: ['Todos os Tipos'],
        coupon: 'GLOW', stock: 0,
        tags: ['produto', 'sabonete', 'rosto', 'vitamina c', 'esfoliante', 'manchas'],
        description: 'Renovação e luminosidade. Remove células mortas enquanto estimula o colágeno.',
        usage: 'Aplique sobre a pele úmida.',
        care: 'Não aplicar sobre pele lesionada.'
    },
    {
        id: 'prod-sabonete-facial-vitc',
        image: 'imagens/Produtos/sabonete-facial-vitamina-c.jpg',
        name: 'Sabonete Facial Vitamina C 100ml',
        price: 34.90,
        rating: 5.0, reviews: 60, collection: 'Home Care',
        sizes: ['100ml'], material: 'Limpeza Iluminadora', colors: ['Uso Diário'],
        coupon: 'VITC10', stock: 0,
        tags: ['produto', 'sabonete', 'rosto', 'vitamina c', 'limpeza', 'clareador'],
        description: 'Higienização diária que trata. Limpa profundamente sem agredir.',
        usage: 'Use de manhã e à noite.',
        care: 'Evite contato com os olhos.'
    },
    {
        id: 'prod-sabonete-glicolico',
        image: 'imagens/Produtos/sabonete-facial-ac-gliconico.jpg',
        name: 'Sabonete Facial Ácido Glicólico 100ml',
        price: 39.90,
        rating: 4.8, reviews: 25, collection: 'Home Care',
        sizes: ['100ml'], material: 'Renovação Celular', colors: ['Peles Espessas'],
        coupon: 'RENOVAR', stock: 0,
        tags: ['produto', 'sabonete', 'rosto', 'acido', 'glicolico', 'anti-idade'],
        description: 'Peeling diário suave. O Ácido Glicólico refina a textura da pele.',
        usage: 'Use preferencialmente à noite.',
        care: 'Uso obrigatório de protetor solar.'
    },
    {
        id: 'prod-sabonete-clareador',
        image: 'imagens/Produtos/sabonete-facial-clareador.jpg',
        name: 'Sabonete Facial Clareador 100ml',
        price: 36.90,
        rating: 4.7, reviews: 40, collection: 'Home Care',
        sizes: ['100ml'], material: 'Complexo Clareador', colors: ['Peles com Melasma'],
        coupon: 'CLARITY', stock: 0,
        tags: ['produto', 'sabonete', 'rosto', 'clareador', 'manchas', 'melasma'],
        description: 'Uniformização do tom. Ativos clareadores que atuam na redução de marcas.',
        usage: 'Lavar o rosto pela manhã e à noite.',
        care: 'Indispensável o uso de filtro solar FPS 50+.'
    },
    {
        id: 'prod-sabonete-sensivel',
        image: 'imagens/Produtos/sabonete-facial-pele-sensivel.jpg',
        name: 'Sabonete Facial Pele Sensível 100ml',
        price: 32.90,
        rating: 4.9, reviews: 20, collection: 'Home Care',
        sizes: ['100ml'], material: 'Hipoalergênico', colors: ['Peles Sensíveis'],
        coupon: 'CALM', stock: 0,
        tags: ['produto', 'sabonete', 'rosto', 'sensivel', 'calmante'],
        description: 'Cuidado extra suave. Limpa sem agredir a barreira cutânea.',
        usage: 'Aplique com movimentos leves.',
        care: 'Ideal para pós-procedimentos ou rosácea.'
    },
    {
        id: 'prod-sabonete-retinol',
        image: 'imagens/Produtos/sabonete-facial-retinol.jpg',
        name: 'Sabonete Facial Retinol 100ml',
        price: 38.90,
        rating: 4.8, reviews: 35, collection: 'Home Care',
        sizes: ['100ml'], material: 'Anti-aging', colors: ['Peles Maduras'],
        coupon: 'YOUNG', stock: 0,
        tags: ['produto', 'sabonete', 'rosto', 'retinol', 'anti-idade'],
        description: 'Limpeza rejuvenescedora. Estimula a renovação celular.',
        usage: 'Use preferencialmente à noite.',
        care: 'Não recomendado para gestantes.'
    },
    {
        id: 'prod-serum-sensivel',
        image: 'imagens/Produtos/serum-facial-pele-sensivel.jpg',
        name: 'Sérum Facial Pele Sensível 30ml',
        price: 49.90,
        rating: 5.0, reviews: 15, collection: 'Home Care',
        sizes: ['30ml'], material: 'Blend Calmante', colors: ['Peles Reativas'],
        coupon: 'SOS', stock: 0,
        tags: ['produto', 'serum', 'rosto', 'sensivel', 'hidratante'],
        description: 'Alívio imediato. Reforça a barreira de proteção e acalma irritações.',
        usage: 'Aplique de 3 a 5 gotas na pele limpa.',
        care: 'Pode ser usado antes da maquiagem.'
    },
    {
        id: 'prod-protetor-50',
        image: 'imagens/Produtos/protetor-solar-facial-50.jpg',
        name: 'Protetor Solar Facial FPS 50 - 50g',
        price: 45.90,
        rating: 4.9, reviews: 80, collection: 'Home Care',
        sizes: ['50g'], material: 'Toque Seco', colors: ['Incolor'],
        coupon: 'SUN50', stock: 0,
        tags: ['produto', 'protetor', 'sol', 'rosto', 'fps50'],
        description: 'Alta proteção com acabamento invisível e controle de oleosidade.',
        usage: 'Aplique abundantemente 30min antes da exposição ao sol.',
        care: 'Reaplicar a cada 2 horas.'
    },
    {
        id: 'prod-hidratante-c15',
        image: 'imagens/Produtos/hidratante-facial-vitamina-c-c15.jpg',
        name: 'Hidratante Facial Vitamina C 15 - 30ml',
        price: 55.90,
        rating: 4.9, reviews: 50, collection: 'Home Care',
        sizes: ['30ml'], material: 'Vit C 15%', colors: ['Todos os Tipos'],
        coupon: 'C15', stock: 0,
        tags: ['produto', 'hidratante', 'rosto', 'vitamina c', 'antioxidante'],
        description: 'Potência máxima antioxidante. Clareia, hidrata e corrige sinais de idade.',
        usage: 'Ideal para uso diurno antes do protetor.',
        care: 'Armazenar longe do calor.'
    }
],
      coupons: [
    // --- CUPONS PADRÃO ---
    {
        code: 'BEAUTY5',
        description: '5% OFF em todo o site.',
        discount_percent: 0.05, 
        valid_until: '2026-12-31',
        is_per_customer: true
    },
    {
        code: 'BEAUTY12',
        description: '12% OFF em seu pedido.',
        discount_percent: 0.12,
        valid_until: '2026-12-31', 
        is_per_customer: true,
        is_new_customer_only: true
    },

    // --- CUPONS EXCLUSIVOS BEAUTY CLUB (Novos Planos) ---
    {
        code: 'CLUBE05',                // Para o Plano BRONZE
        description: '5% OFF Ilimitado | Assinante Bronze',
        discount_percent: 0.05,
        valid_until: '2030-12-31',
        is_per_customer: false          // Uso ilimitado
    },
    {
        code: 'CLUBE15',                // Para o Plano PRATA (Mais Popular)
        description: '15% OFF Ilimitado | Assinante Prata',
        discount_percent: 0.15,
        valid_until: '2030-12-31',
        is_per_customer: false
    },
    {
        code: 'CLUBE20',                // Para o Plano OURO
        description: '20% OFF Ilimitado | Assinante Ouro',
        discount_percent: 0.20,
        valid_until: '2030-12-31',
        is_per_customer: false
    }
],
      partners: [
    { 
        id: 'p1', 
        name: "Hillary Oliveira", 
        role: "Bioesteta e Esteticista", 
        company: "Beauty Esthetica", 
        instagram: "hillar.y_oliveira", 
        whatsapp: "5579981354300", 
        image: "hillary-oliveira.jpg",
        
        // Link leva para a página interna do perfil
        link: "parceiro.html?id=p1",
        
        description: "Bioesteta especializada no cuidado integral e saúde da pele. Seu foco é extrair a sua melhor versão, realçando a beleza natural sem recorrer à artificialidade exagerada. Cada protocolo é pensado para respeitar a sua história e individualidade, com o objetivo final de recuperar e elevar a sua autoestima.",
        
        address: "Rua Campos, 371 - São José, Aracaju - SE",
        
        // SERVIÇOS ATUALIZADOS AQUI:
        services: [
            { name: "Lipocavitação", price: "R$ 79,90" },
            { name: "EMS (Estimulador Muscular)", price: "R$ 79,90" },
            { name: "Combo Lipo + EMS", price: "R$ 119,90" }
        ],
        
        // Portfólio
        portfolio: [
            { image: "before1.jpg", title: "Tratamento de Acne" },
            { image: "before2.jpg", title: "Revitalização" },
            { image: "before3.jpg", title: "Gerenciamento de Manchas" }
        ]
    },
    { 
        id: 'p2', 
        name: "Tays Alves", 
        role: "Lash Designer", 
        company: "Tays Beauty", 
        instagram: "tayssbeautyy", 
        whatsapp: "557999999999", 
        image: "imagens/Equipe/tays-alves.jpg", 
        
        link: "parceiro.html?id=p2",
        
        description: "Transformando olhares com técnicas exclusivas de extensão de cílios, do clássico ao volume russo, sempre preservando a saúde dos fios naturais.",
        address: "Atendimento no Studio Beauty Esthetica",
        services: [
            { name: "Volume Brasileiro", price: "R$ 120,00" },
            { name: "Volume Russo", price: "R$ 150,00" },
            { name: "Lash Lifting", price: "R$ 90,00" }
        ],
        portfolio: [
            { image: "imagens/Portfolio/result1.jpg", title: "Volume Russo" },
            { image: "imagens/Portfolio/result2.jpg", title: "Lash Lifting" },
            { image: "imagens/Portfolio/result3.jpg", title: "Volume Brasileiro" }
        ]
    },
    { 
        id: 'p3', 
        name: "Larissa Moura", 
        role: "Esteticista", 
        company: "Estética Moura", 
        instagram: "esteticamourar", 
        whatsapp: "557988888888", 
        image: "imagens/Equipe/larissa-moura.jpg", 
        
        link: "parceiro.html?id=p3",
        
        description: "Cuidado corporal integrativo. Drenagem linfática método Renata França e massagens relaxantes para o seu bem-estar completo.",
        address: "Atendimento Domiciliar e no Studio",
        services: [
            { name: "Drenagem Linfática", price: "R$ 100,00" },
            { name: "Massagem Relaxante", price: "R$ 90,00" },
            { name: "Modeladora", price: "R$ 110,00" }
        ],
        portfolio: [
            { image: "imagens/Portfolio/result1.jpg", title: "Drenagem Linfática" },
            { image: "imagens/Portfolio/result2.jpg", title: "Massagem Relaxante" },
            { image: "imagens/Portfolio/result3.jpg", title: "Pós-Operatório" }
        ]
    }
],
      portfolio: [
    {
        id: 'p1', 
        title: "Tratamento de Acne", 
        image_after: "result1.jpg", 
        image_before: "before1.jpg", 
        tags: ['facial', 'acne']
    },
    {
        id: 'p2', 
        title: "Peeling e Renovação", 
        image_after: "result2.jpg", 
        image_before: "before2.jpg", 
        tags: ['facial', 'peeling']
    },
    {
        id: 'p3', 
        title: "Controle de Melasma", 
        image_after: "result3.jpg", 
        image_before: "before3.jpg", 
        tags: ['facial', 'melasma']
    }
    // Adicione mais itens aqui!
],
      promotions: {
    // 1. O PRODUTO EM DESTAQUE (Hero)
    featured: {
        id: 'combo-detox-turbo',
        tag: 'OFERTA DO MÊS',
        title: 'Detox Turbo:<br>Drenagem + Manta',
        description: 'A combinação perfeita para desinchar e relaxar. O calor da Manta Térmica potencializa a queima calórica e a Drenagem Linfática elimina todas as toxinas retidas. Sinta-se leve e renovada em apenas 3 sessões.',
        oldPrice: 'R$ 269,90',
        newPrice: 'R$ 199,90',
        image: 'imagens/Servicos/drenagem.jpg',
        btnText: 'QUERO O DETOX TURBO',
        // Link direto pro WhatsApp
        link: 'https://wa.me/5579981354300?text=Ol%C3%A1%2C%20vi%20a%20Oferta%20do%20M%C3%AAs%20(Detox%20Turbo)%20no%20site%20por%20199%2C90%20e%20quero%20agendar%21'
    },

    // 2. A GRADE DE PROMOÇÕES (Apenas as 2 solicitadas)
    items: [
        {
            id: 'promo-lipo-dreno',
            tag: 'REDUÇÃO',
            title: 'Lipo sem Cortes + Drenagem',
            description: 'O ataque duplo à gordura localizada: 03 sessões onde a Lipocavitação quebra as células de gordura e a Drenagem varre tudo para fora.',
            price: 'R$ 249,90',
            image: 'imagens/Servicos/lipocavitacao.jpg', 
            link: 'https://wa.me/5579981354300?text=Ol%C3%A1%2C%20quero%20aproveitar%20a%20promo%20de%20Lipo%20%2B%20Drenagem%20por%20249%2C90.',
            btnText: 'AGENDAR'
        },
        {
            id: 'promo-definicao',
            tag: 'DEFINIÇÃO',
            title: 'Combo Definição Total',
            description: '04 sessões de pura tecnologia: Lipocavitação para tratar a gordura e EMS (Eletroestimulação) para tonificar o músculo simultaneamente.',
            price: 'R$ 329,90',
            image: 'imagens/Servicos/combo-lipo-ems.jpg',
            link: 'https://wa.me/5579981354300?text=Ol%C3%A1%2C%20quero%20o%20Combo%20Defini%C3%A7%C3%A3o%20(Lipo%20%2B%20EMS)%20por%20329%2C90.',
            btnText: 'EU QUERO'
        }
    ]
}
    }
  };

  // Helpers (usados pelo site inteiro)
  function getByPath(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  function wlGet(path, fallback) {
    // path pode começar com "config." ou "theme."
    const clean = path.replace(/^config\./, '').replace(/^theme\./, '');
    const src = path.startsWith('theme.') ? (window.WL.theme || {}) : APP_CONFIG;
    const value = getByPath(src, clean);
    return (value === undefined || value === null || value === "") ? fallback : value;
  }

  function buildWhatsAppLink(message) {
    const base = APP_CONFIG.contacts?.whatsapp?.url || "";
    if (!base) return "#";
    const text = message ? ("?text=" + encodeURIComponent(message)) : "";
    return base + text;
  }

  function applyFeatureToggles(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-wl-feature]').forEach((el) => {
      const key = el.getAttribute('data-wl-feature');
      if (!key) return;
      const enabled = !!APP_CONFIG.features?.[key];
      if (!enabled) el.style.display = 'none';
    });
  }


  function resolveTemplateString(str) {
    if (!str || typeof str !== 'string') return str;
    return str.replace(/\{\{([^}]+)\}\}/g, (match, exprRaw) => {
      const expr = String(exprRaw || '').trim();
      const parts = expr.split('|').map(s => s.trim());
      const path = parts[0];
      const op = parts[1];

      let val = getByPath(APP_CONFIG, path) ?? '';
      if (op === 'upper') val = String(val).toUpperCase();
      return String(val);
    });
  }

  function applyTextReplacements(root) {
    const scope = root || document;
    const reps = APP_CONFIG.whiteLabel?.textReplacements || [];
    if (!reps.length) return;

    // Text nodes
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      let t = node.nodeValue;
      if (!t) continue;
      let changed = false;

      for (const r of reps) {
        if (!r?.from) continue;
        const to = resolveTemplateString(r.to || '');
        if (t.includes(r.from)) {
          t = t.split(r.from).join(to);
          changed = true;
        }
      }
      if (changed) node.nodeValue = t;
    }

    // Common attributes
    const attrNames = ['title', 'aria-label', 'placeholder', 'alt'];
    scope.querySelectorAll(attrNames.map(a => `[${a}]`).join(',')).forEach((el) => {
      attrNames.forEach((a) => {
        const v = el.getAttribute(a);
        if (!v) return;
        let out = v;
        let changed = false;
        for (const r of reps) {
          if (!r?.from) continue;
          const to = resolveTemplateString(r.to || '');
          if (out.includes(r.from)) {
            out = out.split(r.from).join(to);
            changed = true;
          }
        }
        if (changed) el.setAttribute(a, out);
      });
    });
  }

  function applyBindings(root) {
    const scope = root || document;

    // text binding
    scope.querySelectorAll('[data-wl-text]').forEach((el) => {
      const path = el.getAttribute('data-wl-text');
      const v = wlGet(path, '');
      if (v !== '') el.textContent = v;
    });

    // html binding (use com cuidado)
    scope.querySelectorAll('[data-wl-html]').forEach((el) => {
      const path = el.getAttribute('data-wl-html');
      const v = wlGet(path, '');
      if (v !== '') el.innerHTML = v;
    });

    // href/src/alt/value bindings
    const attrMap = [
      ['data-wl-href', 'href'],
      ['data-wl-src', 'src'],
      ['data-wl-alt', 'alt'],
      ['data-wl-value', 'value']
    ];
    attrMap.forEach(([dataAttr, realAttr]) => {
      scope.querySelectorAll('[' + dataAttr + ']').forEach((el) => {
        const path = el.getAttribute(dataAttr);
        const v = wlGet(path, '');
        if (v !== '') el.setAttribute(realAttr, v);
      });
    });

    // whatsapp dynamic links
    scope.querySelectorAll('[data-wl-whatsapp]').forEach((el) => {
      const msgPath = el.getAttribute('data-wl-whatsapp');
      const msg = msgPath ? wlGet(msgPath, '') : '';
      el.setAttribute('href', buildWhatsAppLink(msg));
    });

    applyTextReplacements(scope);
    applyFeatureToggles(scope);
  }

  // Exporta
  window.APP_CONFIG = APP_CONFIG;
  window.WL.config = APP_CONFIG;
  window.WL.get = wlGet;
  window.WL.buildWhatsAppLink = buildWhatsAppLink;
  window.WL.applyBindings = applyBindings;
  window.WL.applyFeatureToggles = applyFeatureToggles;
})();
