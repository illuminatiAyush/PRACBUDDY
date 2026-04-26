.model small
.data
    mem1 dw 1234h
    mem2 dw 5678h
.code
start:
    mov ax, @data
    mov ds, ax
    mov ax, mem1
    mov bx, mem2
    mov mem1, bx
    mov mem2, ax
    int 03h
ends
end
