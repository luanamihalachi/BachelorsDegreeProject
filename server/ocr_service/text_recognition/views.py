from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import easyocr
import json
from io import BytesIO

class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        # se ia imaginea din request
        uploaded_image = request.FILES.get('image')

        if uploaded_image:
            seria=""
            cnp=""
            last_name=""
            first_name=""
            address=""
            # se face ocr pe imaginea preluata
            ocr_result = self.perform_ocr(uploaded_image)
            ocr_list=list(ocr_result.get("text"))
            for i in range(len(ocr_list) - 1):
                if ocr_list[i].lower()=="SERIA".lower():
                    seria=ocr_list[i+1]
                if ocr_list[i].lower()=="NR".lower():
                    seria=seria+ocr_list[i+1]
                if ocr_list[i].lower()=="CNP".lower():
                    cnp=ocr_list[i+1]
                if ocr_list[i].lower().startswith("NUME".lower()):
                    last_name=ocr_list[i+1]
                if ocr_list[i].lower().startswith("PRENUME".lower()):
                    first_name=ocr_list[i+1]
                if ocr_list[i].lower().startswith("DOMICILIU".lower()):
                    address=ocr_list[i+2]

            print(seria,cnp,last_name,first_name,address)
            info={"idCardInfo":seria,"CNP":cnp,"lastName":last_name,"firstName":first_name,"address":address}
            json_info=json.dumps(info)
            # se trimite raspunsul inapoi sub forma de json
            return Response({'message': 'OCR successful', 'ocr_result':json_info}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_ocr(self, uploaded_image):
        try:
            # initializare reader ocr
            reader = easyocr.Reader(['en'])

            # imaginea e citita ca bytes
            image_bytes = uploaded_image.read()

            # se ocr-izeaza imaginea
            ocr_result = reader.readtext(image_bytes)

            # se extrage textul
            extracted_text = [result[1] for result in ocr_result]

            return {'success': True, 'text': extracted_text}
        except Exception as e:
            # erori
            return {'success': False, 'error': str(e)}
