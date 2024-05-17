"use client";
import { FC, useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  key: z.string().optional(),
  day: z.date().optional(),
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
    const { key, day } = values;
    if (!filteredComments) return;

    const filtered = filteredComments
      .map((comment) => ({
        ...comment,
        latestComments: comment.latestComments.filter((latestComment) => {
          const matchesKey = latestComment.text
            .toLowerCase()
            .includes(key?.toLowerCase() || "");
          const matchesDate = day
            ? format(new Date(latestComment.timestamp), "yyyy-MM-dd") ===
              format(day, "yyyy-MM-dd")
            : true;
          return matchesKey && matchesDate;
        }),
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
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        <span className="self-end text-sm text-muted-foreground">
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
