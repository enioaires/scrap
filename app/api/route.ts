export const dynamic = "force-dynamic";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type latestComments = {
  id: string;
  text: string;
  timestamp: string;
};

export type Comment = {
  latestComments: latestComments[];
  url: string;
};

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get<Comment[]>(
      "https://api.apify.com/v2/datasets/Z57eG6FgzeWXJzL33/items?clean=true&fields=latestComments,url&format=json&omit=coauthorProducers,childPosts,musicInfo,taggedUsers,hashtags,dimensionsHeight,ownerFullName,inputUrl,timestamp,images,mentions,videoDuration,type,isSponsored,ownerUsername,productType,alt,shortCode,caption,locationId,videoUrl,videoViewCount,firstComment,locationName,ownerId,isPinned,displayUrl,likesCount,videoPlayCount,commentsCount,id"
    );

    // Palavras-chave associadas a reclamações e críticas
    const keywords = [
      "reclamação",
      "crítica",
      "problema",
      "infelizmente",
      "ruim",
      "não está",
      "não funciona",
      "não consigo",
      "péssimo",
      "horrível",
      "defeito",
      "erro",
      "falha",
      "não",
      "péssima",
      "inaceitável",
      "absurdo",
      "lento",
      "demorado",
      "atrasado",
      "insuportável",
      "desagradável",
      "decepcionante",
      "incompetente",
      "falta",
      "má",
      "inútil",
      "péssima qualidade",
      "desorganizado",
      "estragado",
      "inadequado",
      "desleixo",
      "descaso",
      "desrespeito",
      "indignado",
      "irritante",
      "inaceitável",
      "desastre",
      "prejudicial",
      "danificado",
      "incorreto",
      "inconveniente",
      "dificuldade",
      "insatisfatório",
      "negligência",
      "sem resposta",
      "sem solução",
      "sem suporte",
      "desagradável",
      "dúvida",
      "confuso",
      "impossível",
      "ineficaz",
      "ineficiência",
      "irregular",
      "desgastante",
      "insustentável",
      "inadmissível",
      "caos",
      "crítico",
      "nunca",
      "demora",
      "desapontado",
      "frustrado",
      "mal",
      "desatualizado",
      "não disponível",
      "fracasso",
      "difícil",
      "chateado",
      "fraco",
      "péssima experiência",
      "não recomendo",
      "malfeito",
      "deficiência",
      "inseguro",
      "desatenção",
      "irritado",
      "horrível serviço",
      "medíocre",
      "inapropriado",
      "injusto",
      "ilógico",
      "sem lógica",
      "insatisfação",
      "desafortunado",
      "sacrificante",
      "deplorável",
      "desperdício",
      "cansativo",
      "monótono",
      "desgosto",
      "falta de",
      "insuficiente",
      "estresse",
      "desencorajado",
      "preocupante",
      "lamentável",
      "ineficaz",
      "antiquado",
      "sem utilidade",
      "desumano",
      "não apropriado",
    ];

    // Função para normalizar texto
    const normalizeText = (text: string) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    // Filtrar comentários que contenham qualquer uma das palavras-chave
    const filteredComments = response.data
      .map((item) => {
        const filteredLatestComments = item.latestComments
          .filter((comment) => {
            const normalizedComment = normalizeText(comment.text);
            return keywords.some((keyword) =>
              normalizedComment.includes(normalizeText(keyword))
            );
          })
          .map((comment) => ({
            text: comment.text,
            timestamp: comment.timestamp,
          }));

        return {
          url: item.url,
          latestComments: filteredLatestComments,
        };
      })
      .filter((item) => item.latestComments.length > 0); // Filtrar apenas os itens que possuem comentários após a filtragem

    return NextResponse.json(filteredComments);
  } catch (error: any) {
    return new NextResponse(
      "An error occurred while trying to fetch the operator.",
      { status: 500 }
    );
  }
}
