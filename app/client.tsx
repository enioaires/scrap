"use client";
import { FC, useState } from "react";
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

const formSchema = z.object({
  key: z
    .string()
    .min(2, "Palavra muito pequena")
    .max(50, "Palavra muito grande"),
});

type Props = {
  comments: string[];
};

export const Client: FC<Props> = ({ comments }) => {
  const [filteredComments, setFilteredComments] = useState<string[]>(comments);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { key } = values;
    const normalizedKey = key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const filtered = comments.filter((comment) => {
      const normalizedComment = comment
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return normalizedComment.includes(normalizedKey);
    });

    setFilteredComments(filtered);
  }
  return (
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
        <div className="space-y-2">
          {filteredComments.map((comment) => (
            <div key={comment} className="p-4 bg-gray-700 rounded-md">
              {comment}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
