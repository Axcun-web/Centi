"use client"

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactNode, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}
import React from 'react'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CategoryPicker from "./CategoryPicker";
import { Input } from "@/components/ui/input";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

function CreateTransactionDialog({trigger, type}: Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues:{
            type,
            date: new Date(),
        }
    });

    const queryClient = useQueryClient();

    const[open,setOpen] = useState(false);

    const handleCategoryChange = useCallback((value: string) => {
        form.setValue("category", value);
    }, []);

    const {mutate, isPending} = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully", {
                id: "create-transaction"
        });

        form.reset({
            type,
            description: "",
            amount: 0,
            date: new Date(),
            category: undefined,
        });

        queryClient.invalidateQueries({
            queryKey: ["overview"],
        });

        setOpen(prev => !prev)
      },
    })

    const onSubmit = useCallback((value: CreateTransactionSchemaType) => {
        toast.loading("Creating transaction..." , 
            {id: "create-transaction"}
        );

        mutate({
            ...value,
            date: DateToUTCDate(value.date),
        });
    }, 
    [mutate]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Create a new <span className={cn("m-1", type ==="income" ? "text-emerald-500": "text-red-500")}>
                    {type}
                    </span> 
                    transaction
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control = {form.control}
                        name = "description"
                        render = {({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input defaultValue={""} {...field} />          
                                </FormControl>
                                <FormDescription>
                                    Transaction description (optional)
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control = {form.control}
                        name = "amount"
                        render = {({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input defaultValue={"0"} type="number" {...field} />          
                                </FormControl>
                                <FormDescription>
                                    Transaction amount (required)
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    Transaction: {form.watch("category")}
                    <div className="flex items-center justify-between gap-2">
                    <FormField
                        control = {form.control}
                        name = "category"
                        render = {({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Category Picker</FormLabel>
                                <FormControl>
                                    <CategoryPicker type={type} onChange={handleCategoryChange} /> 
                                </FormControl>
                                <FormDescription>
                                    Select a category for this transaction
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control = {form.control}
                        name = "date"
                        render = {({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Transaction date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={
                                                cn(
                                                    "w-[200px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )
                                            }
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ): (
                                                <span className="">Pick a Date</span>
                                            )} 
                                            <CalendarIcon className="ml-auto h-4 w-4 opcaity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                          <Calendar 
                                          mode="single" 
                                          selected={field.value}
                                          onSelect={value => {
                                            if(!value) return;
                                            console.log("@@CALENDAR", value)
                                            field.onChange(value);
                                          }}
                                          initialFocus

                                        > 

                                          </Calendar>
                                    </PopoverContent>
                                </Popover>
                                {/* <FormControl>
                                    <CategoryPicker type={type} onChange={handleCategoryChange} /> 
                                </FormControl>
                                <FormDescription>
                                    Select a date for this transaction
                                </FormDescription>
                                <FormMessage /> */}
                            </FormItem>
                        )}
                    />
                    </div>
                </form>
            </Form>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant={"secondary"} onClick={() => {
                    form.reset();
                }}
                >
                    Cancel
                </Button>
            </DialogClose>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                {!isPending && "Create"}
                {isPending && <Loader className="animate-spin" />}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}

export default CreateTransactionDialog;