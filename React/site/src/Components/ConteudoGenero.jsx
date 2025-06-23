import React from 'react';
import { useLocation } from 'react-router-dom';

const ConteudoGenero = () => {
  const location = useLocation();
  const eMasculino = location.pathname.includes('masculino');
  const eFeminino = location.pathname.includes('feminino');

  return (
    <div className="conteiner-masc-content">
      {eMasculino && (
        <>
          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Guarda-roupa masculino: por onde começar?</h2>
            <p className='texto-secao'>
              O guarda-roupa masculino moderno valoriza a praticidade e qualidade. Na Artenza, você encontra roupas e acessórios que combinam com um estilo de vida ativo e versátil.
              De looks para o dia a dia até peças ideais para momentos de lazer, temos tudo o que você precisa para se expressar com autenticidade.
              Um bom começo é investir em peças-chave, como camisetas básicas, calças de corte reto, jaquetas estilosas e acessórios funcionais.
              Priorize cores neutras que combinam com tudo e tecidos respiráveis para o clima do dia a dia.
              Montar seu guarda-roupa com foco em qualidade e propósito evita compras por impulso e garante durabilidade.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Como escolher roupas masculinas?</h2>
            <p className='texto-secao'>
              A dica é apostar em peças versáteis! Nossas camisetas, calças, jaquetas, regatas, bermudas e moletons são pensadas para facilitar suas combinações, sem abrir mão do conforto e da estética.
              Tudo com caimento impecável, tecidos leves e duráveis para acompanhar sua rotina.
              Leve em consideração o seu estilo pessoal e o tipo de ocasião — casual, esportiva ou urbana — para fazer escolhas assertivas.
              Apostar em peças que transitam entre diferentes momentos do dia é uma forma inteligente de valorizar o seu investimento em moda masculina.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Acessórios que fazem a diferença</h2>
            <p className='texto-secao'>
              Os acessórios masculinos da Artenza são aliados do seu estilo. Bolsas, mochilas, bonés, viseiras e meias não são apenas funcionais — eles elevam sua produção com personalidade.
              Para quem valoriza detalhes, investir nesses itens é essencial.
              Um bom acessório pode transformar um look básico em algo estiloso e autêntico.
              Além disso, eles oferecem praticidade para o dia a dia, seja para carregar itens, proteger-se do sol ou completar uma composição de forma inteligente.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Artenza: Moda que acompanha seu ritmo</h2>
            <p className='texto-secao'>
              Na Artenza, você encontra uma curadoria de roupas e acessórios pensados para o homem contemporâneo. Complete seu guarda-roupa com estilo e funcionalidade, tudo em um só lugar.
              Independentemente do seu estilo — esportivo, básico ou urbano —, temos opções que acompanham o seu ritmo com autenticidade.
              Nossos produtos são desenvolvidos com atenção aos detalhes, priorizando qualidade, conforto e design para atender às exigências do dia a dia.
              Viver bem é também vestir-se bem. E a Artenza está aqui para ajudar você nessa jornada.
            </p>
          </section>
        </>
      )}

      {eFeminino && (
        <>
          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Guarda-roupa feminino: estilo e liberdade</h2>
            <p className='texto-secao'>
              Na Artenza, acreditamos que o guarda-roupa feminino deve refletir a sua personalidade e acompanhar todas as fases do seu dia. Nossa coleção combina conforto, elegância e autenticidade para que você se sinta bem e confiante em qualquer ocasião.
              Invista em peças versáteis como vestidos fluidos, blusas de tecidos naturais, jeans de modelagens modernas, saias midi e conjuntos coordonnés que permitem combinações criativas e práticas.
              Dica de styling: misture texturas – experimente uma blusa de linho com uma saia plissada ou um blazer estruturado sobre um vestido leve – para dar profundidade ao look.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Como montar looks femininos?</h2>
            <p className='texto-secao'>
              O segredo está no equilíbrio entre tendências e estilo próprio. Nossa seleção traz peças femininas modernas com caimento impecável, que valorizam o corpo e garantem bem-estar.
              Monte um look básico de dia com uma camiseta de algodão orgânico, calça pantacourt e tênis minimalista; para a noite, troque o tênis por uma sandália de salto bloco e adicione um colete ou jaqueta cropped.
              Aposte em camadas: coletes, cardigãs leves e lenços que você pode usar de diferentes formas – no cabelo, na bolsa ou como cinto – para transformar instantaneamente o visual.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Acessórios femininos que transformam</h2>
            <p className='texto-secao'>
              Complemente seus looks com acessórios da Artenza: bolsas de palha para um ar fresh no verão, cintos largos de couro para destacar a cintura, colares longos em sobreposição e brincos statement que trazem personalidade à produção.
              Lenços estampados podem virar turbantes ou amarrações de bolsa; já os sapatos, do mule ao stiletto, seguem a paleta de cores da estação, garantindo versatilidade.
              Para o dia a dia, mochilas e pochetes em materiais leves e resistentes; para eventos especiais, clutches e bolsas μικρές com detalhes em metal ou pedraria.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Moda com propósito: o estilo Artenza</h2>
            <p className='texto-secao'>
              Nossa missão é oferecer moda acessível, sustentável e de qualidade para mulheres que vivem intensamente. Cada peça é pensada para minimizar o desperdício de matéria-prima e valorizar o artesanato local.
              Trabalhamos com tingimentos naturais e fornecedores certificados, garantindo transparência em toda a cadeia. Assim, você veste não só estilo, mas também responsabilidade socioambiental.
              Escolha suas peças sabendo que cada uma carrega uma história de cuidado com o planeta e com quem as faz.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Tendências da estação</h2>
            <p className='texto-secao'>
              Nesta temporada, o tie-dye suave volta repaginado, os cortes assimétricos conquistam espaço em saias e vestidos, e o mix de estampas florais com listras traz um contraste interessante.
              Tons terrosos e pastéis continuam fortes, mas ganham pontos de cor em acessórios e detalhes. Tecidos tecnos, que combinam performance e leveza, aparecem em peças esportivas-chic, perfeitas para o dia a dia.
            </p>
          </section>

          <section className='secao-conteudo'>
            <h2 className='titulo-secao'>Dicas de cuidado e durabilidade</h2>
            <p className='texto-secao'>
              Para manter suas roupas sempre novas, siga as instruções de lavagem: prefira água fria e sabão neutro, evite centrifugação pesada e não deixe as peças de molho. Seque à sombra para preservar cores e fibras.
              Guarde suas peças em cabides adequados e, se possível, use capas de tecido para proteger as jaquetas e vestidos finos do pó. Pequenos consertos – como trocar um botão ou reforçar uma costura – podem estender bastante a vida útil do seu guarda-roupa.
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default ConteudoGenero;
