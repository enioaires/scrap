"use client";
import { FC, useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Root } from "./page";
import { format } from "date-fns";
import { getData } from "@/services/getData";

const formSchema = z.object({
  key: z
    .string()
    .min(2, "Palavra muito pequena")
    .max(50, "Palavra muito grande"),
});

export const Client: FC = () => {
  const [filteredComments, setFilteredComments] = useState<Root[]>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  const handleComments = useCallback(async () => {
    try {
      const response = await getData();
      setFilteredComments(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [setFilteredComments]);

  useEffect(() => {
    handleComments();
  }, [handleComments]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { key } = values;
    if (!filteredComments) return;

    const filtered = filteredComments
      .map((comment) => ({
        ...comment,
        latestComments: comment.latestComments.filter((latestComment) =>
          latestComment.text.toLowerCase().includes(key.toLowerCase())
        ),
      }))
      .filter((comment) => comment.latestComments.length > 0);

    setFilteredComments(filtered);
  }

  if (!filteredComments) return <div>Carregando...</div>;

  return (
    <>
      {filteredComments?.length !== 0 && (
        <div className="flex flex-col justify-center items-center px-96 py-12 gap-8">
          <h1 className="text-3xl font-semibold">Filtro</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-6"
            >
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Palavra Chave" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size="sm" type="submit">
                Filtrar
              </Button>
            </form>
          </Form>
          <ScrollArea>
            <div className="flex flex-col gap-4">
              {filteredComments?.map((comment) => (
                <div
                  key={comment.url}
                  className="flex flex-col gap-2 py-2 bg-slate-700 rounded px-2"
                >
                  <a
                    className="text-lg font-semibold cursor-pointer hover:underline text-center pt-2"
                    href={comment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {comment.url}
                  </a>
                  <div className="flex flex-col gap-2">
                    {comment.latestComments.map((latestComment) => (
                      <div
                        key={latestComment.timestamp}
                        className="flex flex-col gap-2 bg-slate-800 px-2 py-1 rounded"
                      >
                        <p>{latestComment.text}</p>
                        <span className="self-end">
                          {format(
                            new Date(latestComment.timestamp),
                            "dd/MM/yyyy 'às' HH:mm"
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
};
