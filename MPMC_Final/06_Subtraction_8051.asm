ORG 0000H
    MOV R0, #50H
    MOV R1, #20H
    MOV A, R0
    CLR C
    SUBB A, R1
    MOV R2, A
    SJMP $
END
